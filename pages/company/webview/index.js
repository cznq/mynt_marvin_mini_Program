// pages/company/webview/index.js
var app = getApp();
Page({
  data: {
    timestamp: null,
    web_url: app.globalData.WEB_VIEW_URL,
    route:''
  },
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      route: options.page
    })
  }
})