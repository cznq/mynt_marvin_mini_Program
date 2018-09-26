// pages/invite/invite.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation_id: null,
    vip: null,
    timestamp: null,
    web_url: app.globalData.WEB_VIEW_URL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      invitation_id: options.invitation_id,
      vip: options.vip
    })

  },

  getReadyParam: function(e) {
    console.log(e);
  },

  onShow: function () {
    this.setData({
      timestamp: Date.parse(new Date())
    })
  
  }

})