const Promise = require('../../../utils/promise.js');
const utilCal = require('../../../utils/floating-point.js');
var toast = require('../../../templates/showToast/showToast');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cd_CommerceInfo: null,
    cd_CommerceDiscount: null,
    realPrice: 0,
    checkBox: false,
    totalPrice: null,
    outPrice: null,
    keyVal: 0,
    isVip: false,
    employeeInfo: null,
    loadComplete: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.commerce_id = options.commerce_id;
    this.data.type = options.type;
    this.getCommerceInfo(this.data.commerce_id);
    this.getCommerceDiscount(this.data.commerce_id, this.data.type);
    this.sendScanRecord(options.commerce_id);
  },
  /**
   * 获取用户信息
   */
  getEmployeeInfo(sub_mch_id) {
    var that = this;
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/company/get_employee_info",
      params: {
        data: JSON.stringify({})
      },
      showLoading: false,
      success: res => {
        console.log('get_employee_info:', res);
        if (JSON.stringify(res.data.result) !== '{}') {
          that.setData({
            employeeInfo: res.data.result
          })
        }
        app.request.requestApi.post({
          url: app.globalData.BANQUET_API_URL + "/company/get_company_service_status",
          params: {
            data: JSON.stringify({
              service_key: 'EMPLOYEE_BENIFIT'
            })
          },
          success: res => {
            if (res.data.result) {
              if (res.data.result.service_status !== 0) {
                that.setData({
                  isVip: true
                })
              }
            }
            if (sub_mch_id == '') { // 未开通支付
              if (that.data.employeeInfo) { // 小觅用户
                if (that.data.isVip) { // 小觅VIP用户
                  wx.redirectTo({
                    url: '../mall-detail/mall-detail?showVipCard=true&dialog_discount=' + that.data.cd_CommerceDiscount.cate_or_entertainment[0].benifit_content + '&dialog_discount_limit=' + that.data.cd_CommerceDiscount.cate_or_entertainment[0].benifit_limit + '&commerce_id=' + that.data.commerce_id + '&commerce_type=' + that.data.type,
                  })
                } else {
                  wx.redirectTo({
                    url: '../vip-card/vip-card',
                  })
                }
              } else { // 非小觅用户
                wx.redirectTo({
                  url: '/pages/manage/manage',
                })
              }
            } else {
              that.setData({
                loadComplete: true
              })
              wx.setNavigationBarTitle({
                title: '协议买单'
              })
            }
          }
        })
      }
    })
  },

  /**
   * 获取指定商家信息
   */
  getCommerceInfo(commerce_id) {
    var that = this;
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/get_commerce_detail",
      params: {
        data: JSON.stringify({
          "commerce_id": commerce_id
        })
      },
      showLoading: false,
      success: res => {
        console.log("get_commerce_detail:", res);
        if (res.data.result) {
          that.setData({
            cd_CommerceInfo: res.data.result
          })
          that.getEmployeeInfo(res.data.result.sub_mch_id);
        }
      }
    })
  },
  /**
   * 获取商家协议优惠
   */
  getCommerceDiscount(commerce_id, type) {
    var that = this;
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/get_commerce_discount",
      params: {
        data: JSON.stringify({
          "commerce_id": commerce_id,
          "type": type
        })
      },
      showLoading: false,
      success: res => {
        console.log('get_commerce_discount:', res);
        if (res.data.result) {
          that.setData({
            cd_CommerceDiscount: res.data.result
          })
        }
      }
    })
  },
  /**
   * 扫码后发送请求记录扫码次数
   */
  sendScanRecord(commerce_id) {
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/customer/scan",
      params: {
        data: JSON.stringify({
          "commerce_id": commerce_id
        })
      },
      showLoading: false,
      success: res => {
        console.log(res);
      }
    })
  },

  changeCheckBox: function() {
    if (this.data.checkBox) {
      this.setData({
        checkBox: false,
        outPrice: null
      })
      this.calcRealPrice();
    } else {
      this.setData({
        checkBox: true
      })
    }
  },
  inputPrice(event) {
    let pid = event.target.id;
    if (pid == 'tp') {
      this.setData({
        keyVal: 0
      })
    } else if (pid == 'op') {
      this.setData({
        keyVal: 1
      })
    }

  },
  clickKey(event) {
    let value = event.currentTarget.dataset.keyval;
    if (this.data.keyVal == 0) {
      this.handleTotalValue(value);
    } else {
      this.handleOutValue(value);
    }
    this.calcRealPrice();
  },
  handleTotalValue(val) {
    if (val == 'del') {
      this.setData({
        totalPrice: this.data.totalPrice.toString().substr(0, this.data.totalPrice.toString().length - 1)
      });
    } else {
      if (this.data.totalPrice == null) {
        this.setData({
          totalPrice: ''
        })
      }
      //禁止小数点后面输入第三位
      if (this.data.totalPrice.toString().indexOf('.') != -1 && this.data.totalPrice.toString().substr(this.data.totalPrice.toString().indexOf('.'), this.data.totalPrice.toString().length - 1).length > 2) {
        val = ''
      }
      if (val == '.' && (this.data.totalPrice.toString().indexOf('.') != -1 || this.data.totalPrice == '')) {
        val = ''
      }
      this.setData({
        totalPrice: this.data.totalPrice + val
      })
    }
  },
  handleOutValue(val) {
    if (val == 'del') {
      this.setData({
        outPrice: this.data.outPrice.toString().substr(0, this.data.outPrice.toString().length - 1)
      });
    } else {
      if (this.data.outPrice == null) {
        this.setData({
          outPrice: ''
        })
      }
      //禁止小数点后面输入第三位
      if (this.data.outPrice.toString().indexOf('.') != -1 && this.data.outPrice.toString().substr(this.data.outPrice.toString().indexOf('.'), this.data.outPrice.toString().length - 1).length > 2) {
        val = ''
      }
      if (val == '.' && (this.data.outPrice.toString().indexOf('.') != -1 || this.data.outPrice == '')) {
        val = ''
      }
      this.setData({
        outPrice: this.data.outPrice + val
      })
    }
  },
  pay: function() {
    let _this = this
    if (_this.data.realPrice == 0 || _this.data.totalPrice == null) {
      toast.showToast(_this, {
        toastStyle: 'toast',
        title: '请先输入金额',
        duration: 1000,
        mask: false,
        isArrow: true
      });
      return;
    }
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/customer/pay",
      params: {
        data: JSON.stringify({
          "commerce_id": _this.data.commerce_id,
          "total": utilCal.multiply(parseFloat(_this.data.totalPrice), 100),
          "enjoy_discount": _this.data.isVip ? 1 : 0,
          "out_price": _this.data.outPrice == null ? 0 : utilCal.multiply(parseFloat(_this.data.outPrice), 100),
          "total_fee": utilCal.multiply(parseFloat(_this.data.realPrice), 100),
          "pay_type": 3,
          "open_id": wx.getStorageSync('open_id')
        })
      },
      success: res => {
        console.log('/customer/pay:', res);
        if (res.data.sub_code == "SUCCESS") {
          let out_order_id = res.data.result.out_order_id
          wx.requestPayment({
            timeStamp: res.data.result.wx_package.timeStamp,
            nonceStr: res.data.result.wx_package.nonceStr,
            package: res.data.result.wx_package.package,
            signType: 'MD5',
            paySign: res.data.result.wx_package.paySign,
            success: res => {
              console.log('支付成功');
            },
            fail: res => {},
            complete: res => {
              wx.navigateTo({
                url: '/benifit/pages/pay-status/index?out_order_id=' + out_order_id + '&pay_from=commerce'
              })
            }
          });
        } else {
          toast.showToast(_this, {
            toastStyle: 'toast',
            title: res.data.sub_msg,
            duration: 1000,
            mask: false,
            isArrow: true
          });
        }

      }
    })
  },

  calcRealPrice: function() {
    let discount_tag = this.data.cd_CommerceDiscount.discount_tag;
    //console.log(discount_tag.full_price + "==" + discount_tag.discount_type + '==' + discount_tag.discount_price);
    //console.log('totalPrice:'+this.data.totalPrice+'  outPrice:'+this.data.outPrice+'  realPrice:'+this.data.realPrice);
    if (this.data.totalPrice == null || this.data.totalPrice == '') {
      this.setData({
        realPrice: 0
      })
      this.calcSavedPrice();
      return;
    }
    if (this.data.isVip == false) {
      this.setData({
        realPrice: this.data.totalPrice
      })
      this.calcSavedPrice();
      return;
    }
    if (this.data.totalPrice - this.data.outPrice < 0) {
      this.setData({
        realPrice: this.data.totalPrice
      })
      this.calcSavedPrice();
      return;
    }
    if (discount_tag.discount_type == 1) {
      console.log('折扣方式');
      if (this.data.outPrice !== null && this.data.outPrice !== '') {
        let discount_price = utilCal.divide(discount_tag.discount_price, 100)
        let rightPrice = utilCal.subtract(parseFloat(this.data.totalPrice), parseFloat(this.data.outPrice))
        let realPrice =utilCal.add(parseFloat(Math.floor10(utilCal.multiply(parseFloat(rightPrice), parseFloat(discount_price)), -2)), parseFloat(this.data.outPrice))
        this.setData({
          realPrice: realPrice
        })
      } else {
        let discount_price = utilCal.divide(discount_tag.discount_price, 100)
        let realPrice = parseFloat(Math.floor10(utilCal.multiply(parseFloat(this.data.totalPrice), parseFloat(discount_price)),-2))
        this.setData({
          realPrice: realPrice
        })
      }
    } else {
      console.log('满减方式');
      if (this.data.outPrice !== null && this.data.outPrice !== '') {
        this.setData({
          realPrice: this.data.totalPrice - this.data.outPrice >= discount_tag.full_price ? this.data.totalPrice - discount_tag.discount_price : this.data.totalPrice
        })
      } else {
        this.setData({
          realPrice: this.data.totalPrice - discount_tag.full_price >= 0 ? this.data.totalPrice - discount_tag.discount_price : this.data.totalPrice
        })
      }
    }
    this.calcSavedPrice();
  },
  //计算优惠的价格
  calcSavedPrice() {
    if (this.data.realPrice == null || this.data.realPrice == 0 || this.data.totalPrice == null || this.data.totalPrice == '') {
      this.setData({
        savedPrice: ''
      })
    } else {
      this.setData({
        savedPrice: parseFloat((this.data.realPrice - this.data.totalPrice).toFixed(2))
      })
    }
  }

})
