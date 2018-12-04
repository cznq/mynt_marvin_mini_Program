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
    company_verify_code:null
  },
  onLoad: function(options) {
    var _this = this;
    //_this.data.company_verify_code = options.company_verify_code;
    _this.setData({
      company_code: options.company_verify_code,
      CstateCode: _this.data.CstateCode
    })

  }
})