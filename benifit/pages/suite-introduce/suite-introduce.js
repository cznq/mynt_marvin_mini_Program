// pages/suite-introduce/suite-introduce.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    service_suite: 0,
    union_id: wx.getStorageSync('xy_session')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.getSuiteInfos();
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

  },
  getSuiteInfos: function() {
    var that = this;
    that.setData({
      'service_suite': '0',
      'origin_price':'1980',
      'now_price': '198',
      'phone' :'02566693872'
    });
    console.log(123);
  },
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
})