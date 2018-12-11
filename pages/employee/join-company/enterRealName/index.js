var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({
  data: {
    web_url: app.globalData.WEB_VIEW_URL,
    mainTitle: '输入真实姓名',
    button_text: '提交',
    codevalue: '',
    isfocus: true,
    company_code :null,
    form_id:null

  },
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      company_code: options.company_code,
      form_id: options.form_id
    })
  }
})