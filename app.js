//app.js
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
App({
  globalData: {
    xy_session: null,
    BASE_API_URL: 'http://61.149.7.239:10001/mini_program/api/'
  },
  data: {
    xy_session: null,
    js_code: null,
    error: ''
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
        console.log(res.code);
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
          this.globalData.xy_session = res.data.result.union_id;
          wx.setStorageSync('xy_session', res.data.result.union_id);
          this.getCompany();
        } else {
          this.setData({
            error: "没有邀请权限"
          })
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

  getCompany: function () {
    var that = this;
    that.Util.network.POST({
      url: that.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({

        })
      },
      success: res => {
        console.log(res);
        if (res.data.result) {
          that.setData({
            meminfo: res.data.result
          })
        }
        //that.generateMap(res.data.result.address);
      }
    })
  }


})