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
    invoiceStatus: false,
    invoice: {
      bankAccount: "", //银行账号
      bankName: "", //银行名称
      companyAddress: "", //单位地址
      errMsg: "",
      taxNumber: "", //抬头税号
      telephone: "", //手机号码
      title: "", //抬头名称
      type: 0 //0 单位 1 个人
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    const book_id = options.bookid
    const router = options.router
    if (router && router === 'invoice') {
      _this.setData({
        invoiceStatus: false,
      })
    }
    // 设置titleStyle
    wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#FF6923'
      }),
      wx.setNavigationBarTitle({
        title: '当前页面'
      })
    _this.setData({
      book_id: book_id
    }) //获取预定ID
    _this.getOrder_detail(_this)
  },
  getOrder_detail: (_this) => {
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/get_order_detail",
      params: {
        data: JSON.stringify({
          book_id: _this.data.book_id
        })
      },
      success: res => {
        console.log('res:', res);
        if (res.data.sub_code === 'SUCCESS' && res.data.sub_code) {
          const result = res.data.result
          let apply_time = util.formatTime(result.apply_time, 4);
          result.apply_time = apply_time;
          if (result.status == 1) {
            let expect_confirm_time = util.formatTime(result.expect_confirm_time, 4);
            result.expect_confirm_time = expect_confirm_time;
          }
          if (result.status == 2) {
            let confirm_time = util.formatTime(result.confirm_time, 4);
            result.confirm_time = confirm_time;
          }
          if (result.book_type === 2) {
            if (result.appointment_time) {
              let appointment_time = util.formatTime(result.appointment_time, 2);
              result.appointment_time = appointment_time;
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

        }

      },
      fail: res => {
        console.log('res:fail', res);
      }
    })
  },
  jumpDetail() {
    wx.navigateTo({
      url: ''
    })
  },
  /**
   * 立即支付
   */
  quickPay: function() {
    const commerce_name = this.data.detail.commerce.commerce_name;
    const commerce_thumbnail_url = this.data.detail.commerce.commerce_thumbnail_url;
    const pay_price = this.data.detail.pay_price;
    const bookid = this.data.book_id;
    wx.navigateTo({
      url: '../cashier/cashier?bookid=' + bookid + '&commerce_name=' + commerce_name + '&commerce_thumbnail_url=' + commerce_thumbnail_url +
        '&pay_price=' + pay_price
    })
  },
  invoiceBtn() {
    let _that = this;
    wx.chooseInvoiceTitle({
      success(res) {
        console.log('res:', res);

        _that.setData({
          invoice: res,
          invoiceStatus: true
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
  invoiceQuer() {
    wx.navigateTo({
      url: '../reserve-success/index?router=' + 'invoice'
    })

  },
  // previewImage() {
  //   wx.previewImage({
  //     current: '', // 当前显示图片的http链接
  //     urls: [] // 需要预览的图片http链接列表
  //   })
  // },
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
      cb: function() {

      }
    });


  },
  bindToastSure: function() {
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
            if (res.data.sub_code === 'SUCCESS' && res.data.sub_code) {

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
        console.log('resres:', res);

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