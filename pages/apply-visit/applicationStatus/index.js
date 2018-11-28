// pages/apply-visit/applicationStatus/index.js
var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    cd: {},
    button_text: '申请访问该企业',
    background_color:''
  },
  onLoad: function (options) {
    var _this = this;

    var a = 3;

    switch (a) {
      case 1:
        _this.data.background_color = '#007BFF';
        break;
      case 2:
        _this.data.background_color = '#38C361';
        break;
      default:
        _this.data.background_color = '#F5563A';
    }
    
    _this.themeColor(_this.data.background_color);
    _this.setData({
      background_color: _this.data.background_color
    })
    //请求数据
    companyPage.cd(_this, app, "company", "get_info", wx.getStorageSync('xy_session'), function () {
      wx.setNavigationBarTitle({
        title: _this.data.cd.company_short_name
      })
    });

  },
  //机器人端预览
  robotPreview: function () {
    companyPage.robotPreview(this);
  },
  //简介展开功能
  introductionAll: function () {
    companyPage.introductionAll(this);
  },
  //分享
  onShareAppMessage: function (res) {
    var message = companyPage.shareMessage(this);
    return {
      title: message[0],
      path: message[1],
      imageUrl: message[2],
    }
  },
  next: function () {
    wx.reLaunch({
      url: '../reasonsVisiting/index',
    })
  },
  //主题颜色
  themeColor:function(color){
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  }
})