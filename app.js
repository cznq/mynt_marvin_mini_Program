//app.js
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
App({
  globalData: {
    xy_session: null,
    role: null,
    company_info: null,
    latitude: null,
    longitude: null,
    BASE_API_URL: 'https://marvin-api-test.slightech.com/mini_program/api/',
    WEB_VIEW_URL: 'https://marvin-official-account-test.slightech.com'
  },

  data: {

  },

  onLaunch: function () {
    //this.checkLogin();
    this.login();
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
        console.log(res);
        if (res.data.sub_code == 0) {
          this.globalData.invite_auth = true;
          this.globalData.xy_session = res.data.result.union_id;
          wx.setStorageSync('xy_session', res.data.result.union_id);
          if (res.data.result.role !== 0) {
            wx.setStorageSync('invite_auth', true);
          } else {
            wx.setStorageSync('invite_auth', false);
          }
        } else {
          wx.setStorageSync('invite_auth', false);
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
  },

  //获取访客信息
  getVisitorinfo: function () {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_visitor_info',
        union_id: unionId,
        data: JSON.stringify({})
      },
      success: res => {
        return res.data.result;
      }
    })
  },

  //获取邀请信息
  getInitation: function (invitation_id) {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        union_id: unionId,
        data: JSON.stringify({
          invitation_id: invitation_id
        })
      },
      success: res => {
        return res.result;
      },
      fail: res => {
        return "没有获取到邀请信息";
      }
    })
  }

})