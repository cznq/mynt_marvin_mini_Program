const Promise = require('utils/promise.js');
/**
 * Fundebug 打印日志
 * 其它页面引用  app.globalData.fundebug.notify("TEST", "Hello, Fundebug!");
 * 抛出的错误对象   app.globalData.fundebug.notifyError(new Error("TEST"));
 */
var fundebug = require('utils/fundebug.0.9.0.min.js');
// 配置项
fundebug.init({
  apikey: "f7a08bd4f8006965ba11314b2571777ea295a98e84766ade31bdb5c272b87428",
  silent: false
})


App({
  globalData: {
    fundebug: fundebug,
    open_id_type: 1,
    BASE_API_URL: 'http://61.149.7.239:10001/mini_program/api/',
    WEB_VIEW_URL: 'https://marvin-official-account-dev.slightech.com',
    BENIFIT_API_URL: 'http://61.149.7.239:10004/mini_program/api',
    //BASE_API_URL: 'https://marvin-api-test.slightech.com/mini_program/api/',
    //BENIFIT_API_URL: 'https://marvin-benifit-api-test.slightech.com/mini_program/api',
    //BASE_API_URL: 'http://192.168.1.204:10001/mini_program/api/',//开发环境
    //WEB_VIEW_URL: 'https://marvin-official-account-test.slightech.com',
  },
  
  onLaunch: function () {
    wx.getSystemInfo({
      success(res) {
        wx.setStorage({
          key: 'sysinfo',
          data: res,
        })
      }
    })
    this.myLog('test', 'test');
  },         

  /**
   * 自定义日志函数
   */       
  myLog(tit, cont) {
    var sysinfo = wx.getStorageSync('sysinfo');
    fundebug.notify(tit, cont + '--' + JSON.stringify(sysinfo));
  },
  
  Util: require('utils/util.js'),

  /**
   * 检查App是否登录
   */
  checkSession: function () {
    if (wx.getStorageSync('xy_session') == '' || wx.getStorageSync('xy_session') == null) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 静默登录
   */
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
                  console.log(res.data);
                  if (res.data.sub_code == 0) {
                    that.globalData.invite_auth = true;
                    wx.setStorageSync('xy_session', res.data.result.union_id);
                    wx.setStorageSync('open_id', res.data.result.open_id);
                    wx.setStorageSync('nickname', res.data.result.nickname);
                    wx.setStorageSync('avatar', res.data.result.avatar);
                    wx.setStorageSync('invite_auth', false);
                    wx.setStorageSync('inviteVip_auth', false);
                    if (res.data.result.role !== 0) {
                      wx.setStorageSync('invite_auth', true);
                    } 
                    if (res.data.result.role == 3) {
                      wx.setStorageSync('inviteVip_auth', true);
                    } 
                  } 
                  resolve(res);
                },
                fail: res => {
                  fundebug.notify("登录失败", res.sub_msg)
                  console.log('fail');
                }
              });

            } else {
              fundebug.notify("微信登录失败", res.errMsg)
              console.log('获取用户登录态失败！' + res.errMsg);
              reject('error');
            }
          }
        })
      }
    })
  },

  /**
   * 授权登录，弹出授权框
   */
  authorizeLogin(encryptedData, iv, callback = function () { }) {
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
                wx.setStorageSync('xy_session', res.data.result.union_id);
                wx.setStorageSync('nickname', res.data.result.nickname);
                wx.setStorageSync('avatar', res.data.result.avatar);
                callback();
              } else {
                wx.showModal({
                  content: '授权登录失败',
                  showCancel: false
                })
              }
              
            },
            fail: res => {
              console.log('fail');
            }
          });
                   
        }
      },
      fail: res => {
        console.log('获取用户登录态失败！' + res.errMsg);
      }
    })
    
  }
  
  

})