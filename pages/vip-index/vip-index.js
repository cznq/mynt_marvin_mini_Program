// pages/vip-index/vip-index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goInvite: function () {
    wx.redirectTo({
      url: '/pages/vip-invite/vip-invite',
    })
  }


})