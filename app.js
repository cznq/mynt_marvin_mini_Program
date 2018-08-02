//app.js
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
App({
  globalData: {
    xy_session: null,
    company_info: null,
    invite_auth: null,
    BASE_API_URL: 'http://61.149.7.239:10001/mini_program/api/'
  },

  onLaunch: function () {
    this.checkLogin();
    //this.login();
  },

  Util: require('utils/util.js'),

  // 检查App是否登录
  checkLogin: function () {
    if (wx.getStorageSync('xy_session') == '' || wx.getStorageSync('xy_session') == null) {
      this.login();
    }
  },

  // 登录
  login: function () {
    console.log("login action");
    wx.login({
      success: res => {
        this.serverLogin(res.code);
      }
    })
  },

  serverLogin: function (code) {
    // 登录请求
    this.Util.network.POST({
      url: this.globalData.BASE_API_URL,
      params: {
        service: 'oauth',
        method: 'login',
        data: JSON.stringify({
          code: code
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {
          this.globalData.invite_auth = true;
          this.globalData.xy_session = res.data.result.union_id;
          wx.setStorageSync('xy_session', res.data.result.union_id);

        } else {
          this.globalData.invite_auth = false;
          wx.showModal({
            title: '你没有邀请权限',
            content: '请先加入成为公司员工，才能获得邀请权限',
            showCancel: false,
            success: function (res) {

            }
          })
        }

      }
    });
  }

})