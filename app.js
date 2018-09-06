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
    BASE_API_URL: 'http://61.149.7.239:10001/mini_program/api/',
    WEB_VIEW_URL: 'https://marvin-official-account-dev.slightech.com'
    //BASE_API_URL: 'https://marvin-api-test.slightech.com/mini_program/api/',
    //WEB_VIEW_URL: 'https://marvin-official-account-test.slightech.com'
  },

  onLaunch: function () {
    
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

  checkLogin() {
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
                  console.log(res);
                  if (res.data.sub_code == 0) {
                    that.globalData.invite_auth = true;
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

  authorizeLogin(encryptedData, iv) {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res.code + "--" + encryptedData + "--" + iv);
          that.Util.network.POST({
            url: that.globalData.BASE_API_URL,
            params: {
              service: 'oauth',
              method: 'login',
              data: JSON.stringify({
                code: res.code,
                encrypted_data: encryptedData,
                iv: iv
              })
            },
            success: res => {
              console.log(res);
              if (res.data.sub_code == 0) {
                console.log(res);
              } else {
                
              }
              
            },
            fail: res => {
              console.log('fail');
            }
          });
                   
        }
      },
      fail: res => {

      }
    })
    
  }

})