
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      company_id: options.company_id
    })
  }


})