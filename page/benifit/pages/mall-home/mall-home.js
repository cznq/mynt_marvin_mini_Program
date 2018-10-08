// pages/benifit-card/benifit-card.js
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
    shopList: null,
    tabSelected: 'food',
    tabList: [{
      id: 'food',
      title: '美食'
    },
    {
      id: 'entertainment',
      title: '娱乐'
    },
    {
      id: 'hotel',
      title: '酒店'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  changeTab: function (e) {
    console.log(e);
    var selectedId = e.target.id;
    this.setData({ tabSelected: selectedId });
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