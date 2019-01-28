// pages/suite-introduce/suite-introduce.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 'wait',
    phone: '0571-82417637'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.searchOrderInfo(self, options.out_order_id);

  },

  searchOrderInfo(_this, out_order_id) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'pay',
        method: 'get_order_info',
        data: JSON.stringify({
          out_order_id: out_order_id
        })
      },
      success: res => {
        if (res.data.result.status == 1) {
          _this.setData({ status: 'success' })
        } else if (res.data.result.status == 0) {
          _this.setData({ status: 'fail' })
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
    wx.redirectTo({
      url: '/benifit/pages/suite-introduce/suite-introduce',
    })
  }
})