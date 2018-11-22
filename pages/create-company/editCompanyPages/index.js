// pages/create-company/editcompanyPages/index.js
var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    CstateCode: 2,
    cd: {},
    button_text: '编辑企业信息'
  },
  onLoad: function (options) {
    var _this = this;
    //_this.data.CstateCode = options.CstateCode;
    // if (options.CstateCode == 1) {
    //   wx.setNavigationBarTitle({
    //     title: '创建公司'
    //   })
    // } else if (options.CstateCode == 2) {
    //   wx.setNavigationBarTitle({
    //     title: '编辑企业信息'
    //   })
    // }
    wx.setNavigationBarTitle({
      title: '编辑企业信息'
    })
    //请求数据
    companyPage.cd(_this, app, "company", "get_info", wx.getStorageSync('xy_session'));

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
  //编辑企业信息
  next: function () {
    var _this = this;
    wx.reLaunch({
      url: '../guide/index?CstateCode=' + _this.data.CstateCode,
    })
  }
})