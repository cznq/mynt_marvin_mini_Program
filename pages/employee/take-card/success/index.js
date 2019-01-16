// pages/employee/take-card/success/index.js
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
    
  },

  /**
   * 返回快捷取卡指南页
   */
  backGuide: function () {
    wx.navigateTo({
      url: '/pages/employee/take-card/guide/index'
    })
  }

  
})