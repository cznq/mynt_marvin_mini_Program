// pages/create-company/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: 'Welcome to use building services.',
    introduce:'Join a company and start enjoying high-end building services like visitor invitations, building statistics, employee quick access cards',
    copy:'Company hasen’t been settled. ',
    copy2:'Create a new company.',
    button_text:'下一步'

  },
  next:function(){
    wx.navigateTo({
      url: '../company-code/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})