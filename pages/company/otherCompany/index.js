
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