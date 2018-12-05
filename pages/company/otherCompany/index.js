
var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    cd: {}
  },
  onLoad: function (options) {
    var _this = this;
    _this.data.company_code = options.company_code;
    
    //请求数据
    companyPage.cd(_this, app, "company", "get_company_info", options.company_code);

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2].route;
    console.log(prevPage);
    if (prevPage == 'pages/employee/homepage/index') {
      _this.setData({
        quitBtn: true
      })
    }

  },

  quitCompany: function () {
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
        if (res.data.sub_code == 0){
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
  }

})