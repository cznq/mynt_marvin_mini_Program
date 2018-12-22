// pages/company/webview/index.js
var app = getApp();
Page({
  data: {
    timestamp: null,
    web_url: app.globalData.WEB_VIEW_URL,
    route:'',
    page_url: ''
  },
  onLoad: function (options) {
    app.Util.checkcanIUse('web-view');
    var _this = this;
    _this.setData({
      page_url: _this.data.web_url + '/' + options.page + '/record'
    })
  }
})