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
    form_id:null,
    view_web_url:''
  },
  onLoad: function (options) {
    var _this = this;
    var view_web_url = _this.data.web_url + '/employee/join?company_code =' + options.company_code + '&CstateCode=2&form_id=' + options.form_id;
    console.log(view_web_url);
    _this.setData({
      view_web_url: view_web_url
    })
  }
})