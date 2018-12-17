// pages/create-company/editcompanyPages/index.js
var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    CstateCode: 2,
    cd: {},
    button_text: '编辑企业信息',
    islock: true,
    role: true,
    isCoverView: true,//视频全屏cover-view隐藏
  },
  onShow: function() {
    console.log('onshow');
    var _this = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {
          if (res.data.result.role == 3) {
            _this.data.isRobotReview = true;
          }
        } else {
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    });
    if (_this.data.islock) {
      companyPage.cd(_this, app, "company", "get_info", wx.getStorageSync('xy_session'));
    }
    _this.data.islock = true;
  },
  onLoad: function(options) {
    var _this = this;
    _this.data.islock = false;
    if (options.role == 1) {
      _this.setData({
        role: false
      })
    }
    wx.setNavigationBarTitle({
      title: '编辑企业信息'
    })
    //请求数据
    companyPage.cd(_this, app, "company", "get_info", wx.getStorageSync('xy_session'));
    
  },
  //机器人端预览
  robotPreview: function() {
    companyPage.robotPreview(this);
  },
  //简介展开功能
  introductionAll: function() {
    companyPage.introductionAll(this);
  },
  //分享
  onShareAppMessage: function(res) {
    var message = companyPage.shareMessage(this);
    return {
      title: message[0],
      path: message[1],
      imageUrl: message[2],
    }
  },
  //视频全屏cover-view隐藏
  fullScreen: function (e) {
    var _this = this;
    if (e.detail.fullScreen) {
      _this.setData({
        isCoverView: false
      })
    } else {
      _this.setData({
        isCoverView: true
      })
    }
  },
  //编辑企业信息
  next: function() {
    var _this = this;
    wx.navigateTo({
      url: '../guide/index?CstateCode=' + _this.data.CstateCode,
    })
  }
})