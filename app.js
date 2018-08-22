//app.js
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
const Promise = require('utils/promise.js');
App({
  globalData: {
    xy_session: null,
    role: null,
    company_info: null,
    latitude: null,
    longitude: null,
    BASE_API_URL: 'https://marvin-api.slightech.com/mini_program/api/',
    WEB_VIEW_URL: 'https://marvin-official-account.slightech.com'
  },

  onLaunch: function () {
    //this.checkLogin();
  },

  Util: require('utils/util.js'),

  // 检查App是否登录
  checkSession: function () {
    if (wx.getStorageSync('xy_session') == '' || wx.getStorageSync('xy_session') == null) {
      return false;
    } else {
      return true;
    }
  },

  checkLogin: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      if (that.checkSession()) {
        resolve();
      } else {
        wx.login({
          success: res => {
            if (res.code) {      
              console.log("-----login-----");
              that.Util.network.POST({
                url: that.globalData.BASE_API_URL,
                params: {
                  service: 'oauth',
                  method: 'login',
                  data: JSON.stringify({
                    code: res.code
                  })
                },
                success: res => {
                  if (res.data.sub_code == 0) {
                    that.globalData.invite_auth = true;
                    that.globalData.xy_session = res.data.result.union_id;
                    wx.setStorageSync('xy_session', res.data.result.union_id);
                    if (res.data.result.role !== 0) {
                      wx.setStorageSync('invite_auth', true);
                    } else {
                      wx.setStorageSync('invite_auth', false);
                    }
                    if (res.data.result.role == 3) {
                      wx.setStorageSync('inviteVip_auth', true);
                    } else {
                      wx.setStorageSync('inviteVip_auth', false);
                    }
                  } else {
                    wx.setStorageSync('invite_auth', false);
                    wx.setStorageSync('inviteVip_auth', false);
                  }
                  resolve(res);
                },
                fail: res => {
                  console.log('fail');
                }
              }); 

            } else {
              console.log('获取用户登录态失败！' + res.errMsg);
              reject('error');
            }
          }
        })
        
      }
    })
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