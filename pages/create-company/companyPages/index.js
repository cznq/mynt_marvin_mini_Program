// pages/create-company/companyPages/index.js
var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    //CstateCode: 1,
    cd:{},
    button_text:'确认创建公司',
    isCoverView:true,//视频全屏cover-view隐藏
    isrobotReview: true
  },
  onLoad: function (options) {
    var _this = this;
    wx.setNavigationBarTitle({
      title: '创建公司'
    })
    //请求数据
    companyPage.cd(_this, app, "company", "get_info", wx.getStorageSync('xy_session'));
  },
  //机器人端预览
  robotPreview:function(){
    companyPage.robotPreview(this);
  },
  //简介展开功能
  introductionAll:function(){
    companyPage.introductionAll(this);
  },
  //视频全屏cover-view隐藏
  fullScreen: function (e){
    var _this = this;
    if (e.detail.fullScreen){
      _this.setData({
        isCoverView:false
      })
    }else{
      _this.setData({
        isCoverView: true
      })
    }
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
  //确认创建公司
  next:function(){
    wx.reLaunch({
      url: '../../manage/manage',
    })
  }
})