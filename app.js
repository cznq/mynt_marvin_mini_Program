//app.js
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
App({
  globalData: {
    js_code: null,
    xy_session: null,
    openid: null,
    unionid: null,
    userInfo: null,
    meminfo: null,
    latitude: null,
    longitude: null,
    BASE_URL: 'https://sendcard.slightech.com/'
  },
  
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    //this.login();
    //this.globalData.xy_session = wx.getStorageSync('xy_session');
  }

})