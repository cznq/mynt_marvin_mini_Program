var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    mainTitle: '输入真实姓名',
    button_text: '下一步',
    isfocus: true,
    CstateCode:1,//1为创建 2为编辑
    web_url: app.globalData.WEB_VIEW_URL,
    company_code:null,
    company_verify_code:null,
    view_web_url:''
  },
  onLoad: function(options) {
    var _this = this;
    app.Util.checkcanIUse('web-view');
    var view_web_url = _this.data.web_url + '/admin/become?company_code=' + options.company_verify_code + ' &CstateCode=' + _this.data.CstateCode;
    _this.setData({
      view_web_url: view_web_url
    })
  }
})