const app = getApp();
const util = require('../../../utils/util');
var toast = require('../../../templates/showToast/showToast');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    book_id: 0,
    detail: {},
    invoice: {
      bankAccount: "", //银行账号
      bankName: "", //银行名称
      companyAddress: "", //单位地址
      errMsg: "",
      taxNumber: "", //抬头税号
      telephone: "", //手机号码
      title: "", //抬头名称
      type: 0 //0 单位 1 个人
    },
    statusPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 设置titleStyle
    wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#FF6923'
      }),
      wx.setNavigationBarTitle({
        title: '当前页面'
      })
    const _this = this;
    const book_id = options.bookid
    const router = options.router
    console.log('router:', router);
    console.log('options.bookid:', book_id);

    // if (router && router === 'invoice') {
    //   _this.setData({
    //     invoiceStatus: false,
    //   })
    // }
    if (book_id) {
      _this.setData({
        book_id: book_id
      }) //获取预定ID
    }

    _this.getOrder_detail(_this, _this.data.book_id)
  },
  getOrder_detail: (_this, book_id) => {
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/get_order_detail",
      params: {
        data: JSON.stringify({
          book_id: book_id
        })
      },
      success: res => {
        console.log('res:', res);
        if (res.data.sub_code === 'SUCCESS' && res.data.sub_code) {
          const result = res.data.result
          let apply_time = util.formatTime(result.apply_time, 4);
          result.apply_time = apply_time;
          if (result.status == 1) { //待确定
            let expect_confirm_time = util.formatTime(result.expect_confirm_time, 4);
            result.expect_confirm_time = expect_confirm_time;
          }
          if (result.status == 2) { //待消费
            let confirm_time = util.formatTime(result.confirm_time, 4);
            result.confirm_time = confirm_time;
          }
          if (result.book_type == 2) { //宴请
            if (result.fete.appointment_time) {
              let appointment_time = util.formatTime(result.fete.appointment_time, 2);
              result.fete.appointment_time = appointment_time;
            }

          } else {
            let expect_arrive_time = util.formatTime(result.hotel.expect_arrive_time, 2);
            result.hotel.expect_arrive_time = expect_arrive_time;
            let bookBeginTime = util.formatTime(result.hotel.book_begin_time, 3);
            let bookEndTime = util.formatTime(result.hotel.book_endTime, 3);
            let dateDiff_Day = util.dateDiff_Day(bookBeginTime, bookEndTime);
            result.hotel.book_begin_time = bookBeginTime;
            result.hotel.book_endTime = bookEndTime;
            result.hotel.dateDiff_Day = dateDiff_Day;
          }
          _this.setData({
            detail: result
          })
        } else {
          _this.setData({
            detail: {}
          })
          wx.showToast({
            title: '数据不存在',
            icon: 'none'
          })
        }

      },
      fail: res => {
        console.log('res:fail', res);
      }
    })
  },
  jumpDetail(e) {
    const commerceid = e.currentTarget.dataset.commerceid;
    wx.navigateTo({
      url: '../detail/index?commerce_id=' + commerceid
    })
  },
  /**
   * 立即支付
   */
  quickPay: function() {
    const commerce_name = this.data.detail.commerce.commerce_name;
    const commerce_thumbnail_url = this.data.detail.commerce.commerce_thumbnail_url;
    const pay_price = this.data.detail.pay_price / 100;
    const bookid = this.data.book_id;
    wx.navigateTo({
      url: '../cashier/cashier?bookid=' + bookid + '&commerce_name=' + commerce_name + '&commerce_thumbnail_url=' + commerce_thumbnail_url +
        '&pay_price=' + pay_price
    })
  },
  invoiceBtn() {
    let _this = this;
    wx.chooseInvoiceTitle({
      success(res) {
        console.log('res:', res);
        _this.setData({
          invoice: res,
        })
        app.request.requestApi.post({
          url: app.globalData.BANQUET_API_URL + "/commerce/book/apply_invoice",
          params: {
            data: JSON.stringify({
              book_id: _this.data.book_id,
              invoice_title: _this.daat.invoice.title,
              invoice_number: _this.daat.invoice.taxNumber
            })
          },
          success: res => {
            console.log('发票申请成功:', res);
            _this.setData({
              ['detail.invoice_status']: 1
            })

          },
          fail: res => {
            console.log('res:fail', res);
          }
        })

      },
      fail(res) {
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },
  invoiceView() {
    const _this = this;
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/get_invoice_images",
      params: {
        data: JSON.stringify({
          book_id: _this.data.book_id
        })
      },
      success: res => {
        console.log('发票信息:', res);
        if (res.data.result && res.data.result.length > 0) {
          wx.previewImage({
            urls: res.data.result
          })
        } else {
          wx.showToast({
            title: '暂无发票信息',
            icon: 'none'
          })
        }
      },
      fail: res => {
        console.log('res:fail', res);
      }
    })
  },
  callUp() {
    wx.makePhoneCall({
      phoneNumber: '0571-82613693' // 仅为示例，并非真实的电话号码
    })
  },
  canlceBtn() {
    const _this = this
    toast.showToast(_this, {
      toastStyle: 'toast6',
      title: '您确定要取消订单吗？',
      mask: true,
      isSure: true,
      sureText: '是的',
      isClose: true,
      closeText: '暂不取消',
    });


  },
  bindToastSure: function() { //确认取消订单
    const _this = this;
    toast.hideToast(this, {
      cb: function() {
        app.request.requestApi.post({
          url: app.globalData.BANQUET_API_URL + "/commerce/book/cancel_order",
          params: {
            data: JSON.stringify({
              book_id: _this.data.book_id
            })
          },
          success: res => {
            console.log('res:', res);
            if (res.data.return_code === 'SUCCESS' && res.data.sub_code) {
              _this.setData({
                ['detail.status']: 5
              })
            }
          },
          fail: res => {
            console.log('res:fail', res);
          }
        })
      }
    });
  },
  bindToastClose: function() {
    const _this = this;
    toast.hideToast(this, {
      cb: function() {}
    });
  },
  viewRecord() {
    const _this = this;
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/get_bill_images",
      params: {
        data: JSON.stringify({
          book_id: _this.data.book_id
        })
      },
      success: res => {
        console.log('小票信息:', res);
        if (res.data.result && res.data.result.length > 0) {
          wx.previewImage({
            urls: res.data.result
          })
        } else {
          wx.showToast({
            title: '暂无小票信息',
            icon: 'none'
          })
        }
      },
      fail: res => {
        console.log('res:fail', res);
      }
    })
    // wx.previewImage({
    //   urls: [bill_image_url] // 需要预览的图片http链接列表
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const _this = this;
    if (_this.data.statusPage) {
      console.log(3333);
      _this.getOrder_detail(_this, _this.data.book_id)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})