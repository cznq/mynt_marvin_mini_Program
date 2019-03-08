// assets/pages/management/assets-list/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    hasAssets:false,
    noneAssets: {
      pointer: true,      
      title: '暂无资产',
      textInfo: '创建资产，开启智能收费核销',
      pic:app.globalData.BASE_IMG_URl +'assets/empty_no_asset%402x.png',
      picSize:{
        width:180+'rpx',
        height:144+'rpx',
        marginTop: 306+'rpx'
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  addAsset:function(){
    wx.navigateTo({
      url: '../add-asset/index',
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