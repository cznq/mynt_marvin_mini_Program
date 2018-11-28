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
    _this.data.company_code= options.company_code;
 
    //请求数据
    companyPage.cd(_this, app, "company", "get_company_info",options.company_code,function(){
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
    var _this = this;
    wx.reLaunch({
      url: '../reasonsVisiting/index?company_id=' + _this.data.cd.company_id + '&is_force_visitor_input_info=' + _this.data.cd.is_force_visitor_input_info + '&take_card_ways=' + _this.data.cd.take_card_ways
    })
  }
})