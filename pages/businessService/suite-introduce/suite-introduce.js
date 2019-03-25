// pages/suite-introduce/suite-introduce.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isiphoneX: app.globalData.isIphoneX
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.getSuiteInfos();
    
  },

  /**
   * 立即支付
   */
  quickPay: function () {
    wx.redirectTo({
      url: '/pages/businessService/servicePay/index'
    })
  },

  getSuiteInfos: function() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_service_pack_html_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res);
        if (res.data.result) {
            that.setData({
              phone: res.data.result.phone,
              cost_price: res.data.result.cost_price,
              current_price: res.data.result.current_price,
              image: res.data.result.image,
            })
        }
      }
    })
  },
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  }
})