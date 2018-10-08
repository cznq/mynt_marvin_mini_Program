// pages/mall-detail/mall-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slide_data: {
      imgUrls: [
        'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
        'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
      ],
      indicatorDots: false,
      autoplay: true,
      interval: 20000,
      duration: 1000
    },
    curPosition: "discSec",
    showVipCard: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  gotoView: function() {
    this.setData({
      curPosition: 'comtSec'
    })
    console.log("click");
  },

  closeDialog: function () {
    this.setData({
      showVipCard: false
    })
  },

  cardTopay: function () {
    this.setData({
      showVipCard: true
    })
  },

  viewPhoto: function () {
    wx.previewImage({
      current: '',
      urls: this.data.slide_data.imgUrls
    })
  },

  enterComment: function () {
    wx.navigateTo({
      url: '/page/benifit/pages/mall-comment/mall-comment',
    })
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