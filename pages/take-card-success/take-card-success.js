// pages/take-card-success/take-card-success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      company_id: options.company_id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  goToGuide: function() {
    wx.redirectTo({
      url: '/pages/take-card-guide/take-card-guide?company_id=' + this.data.company_id
    })
  }

  

})