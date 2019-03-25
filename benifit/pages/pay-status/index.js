// pages/suite-introduce/suite-introduce.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 'wait',
    phone: '0571-82617637',
    pay_from: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      pay_from: options.pay_from
    })
    if (options.pay_from == 'commerce'){
      _this.searchOrderInfo(_this, options.out_order_id, app.globalData.BENIFIT_API_URL);
    } else if (options.pay_from == 'package') {
      _this.searchOrderInfo(_this, options.out_order_id, app.globalData.BASE_API_URL);
    }
    
  },
  //套餐订单查询
  searchOrderInfo(_this, out_order_id, requestUrl) {
    app.Util.network.POST({
      url: requestUrl,
      params: {
        service: 'pay',
        method: 'get_order_info',
        data: JSON.stringify({
          out_order_id: out_order_id
        })
      },
      success: res => {
        if (res.data.result) {
          if (res.data.result.status == 1) {
            _this.setData({ status: 'success' })
          } else if (res.data.result.status == 0) {
            _this.setData({ status: 'fail' })
          }
        } else {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none'
          })
        } 

      },
      fail: res => { }
    })
  },
  
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  backPay() {
    if (this.data.pay_from == 'commerce') {
      wx.navigateBack();
    } else if (this.data.pay_from == 'package') {
      wx.redirectTo({
        url: '/pages/businessService/suite-introduce/suite-introduce',
      })
    }
    
  }
})