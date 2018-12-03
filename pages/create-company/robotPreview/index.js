// pages/create-company/robotPreview/index.js
var app = getApp();
Page({
  data: {
    imageUrlArr: [
      app.globalData.BASE_IMG_URl + 'preview_homepage.png', 
      app.globalData.BASE_IMG_URl +'preview_standby.png'
      ]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '机器人端预览'
    })
  }
})