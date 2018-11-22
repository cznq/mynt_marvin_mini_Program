// pages/apply-visit/noAppointment/index.js
var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    cd: {},
    button_text: '申请访问该企业'
  },
  onLoad: function (options) {
    var _this = this;
    
 
    //请求数据
    companyPage.cd(_this, app, "company", "get_info", wx.getStorageSync('xy_session'),function(){
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
  }
})