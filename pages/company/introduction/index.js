var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
var toast = require('../../../templates/showToast/showToast');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    cd: {},
    quitBtn: true
  },
  quitCompany: function() {
    var _this = this;
    toast.showToast(this, {
      toastStyle: 'toast5',
      title: '确认要退出' + _this.data.cd.company_short_name + '吗？',
      mask: true,
      isSure: true,
      sureText: '退出企业',
      isClose: true,
      closeText: '取消'
    });
  },
  //取消关闭弹层
  bindToastClose: function() {
    toast.hideToast();
  },
  //确定退出企业
  bindToastSure: function() {
    var _this = this;
    toast.hideToast(this, {
      cb: function() {
        _this.get_quitCompany();
      }
    });
  },
  onLoad: function(options) {
    var _this = this;
    //请求数据
    companyPage.cd(_this, app, "company", "get_info", wx.getStorageSync('xy_session'));
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2].route;
    console.log(prevPage);
    if (prevPage == 'pages/employee/homepage/index') {
      _this.setData({
        quitBtn: true
      })
    }
  },
  get_quitCompany: function() {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'unbind_employee',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {
          wx.removeStorageSync('xy_session');
          wx.redirectTo({
            url: '/pages/manage/manage',
          })
        } else {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none'
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: '退出失败',
          icon: 'none'
        })
      }
    })
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
  }
})