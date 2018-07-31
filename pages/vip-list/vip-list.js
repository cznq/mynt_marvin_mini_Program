
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    js_code: null,
    xy_session: null,
    openid: null,
    unionid: null,
    userInfo: null,
    meminfo: null,
    formready: false,
    input1: false,
    vips: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.login();
  },

  // 登录
  login: function () {

    wx.login({
      success: res => {
        this.setData({
          js_code: res.code
        })
        this.getUserInfo();
      }
    })
  },

  // 获取用户资料
  getUserInfo: function (login = true, callback = function () { }) {
    wx.authorize({
      scope: 'scope.userInfo',
      success: () => {
        this.getUserInfoSuccess(login, callback);
      },
      fail: (res) => {
        console.log(res);
        if (res.errMsg != 'authorize:fail auth deny') return;
        wx.showModal({
          title: '未授权',
          content: '需要获取用户信息，请在下一个页面中打开用户信息授权',
          cancelColor: '#96588a',
          confirmColor: '#96588a',
          confirmText: '设置授权',
          success: res => {
            if (res.confirm) {
              wx.openSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo'] == true) {
                    this.getUserInfoSuccess(login, callback);
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  // 获取用户资料成功
  getUserInfoSuccess: function (login = true, callback = function () { }) {

    wx.getUserInfo({
      success: res => {
        // 存储用户信息
        //console.log(res.userInfo);
        this.setData({
          userInfo: res.userInfo
        })

        wx.setStorageSync('userInfo', res.userInfo);
        callback(res.userInfo);
        if (!login) return;
        // 登录请求
        this.Util.network.POST({
          url: app.globalData.BASE_API_URL + "wechat/intapp/login",
          params: {
            js_code: this.data.js_code,
            encryptedData: res.encryptedData,
            iv: encodeURIComponent(res.iv)
          },
          success: res => {
            // 存储Sessionc
            console.log(res);
            this.setData({
              xy_session: res.data.xy_session,
              meminfo: res.data.meminfo
            })
            this.getVip(res.data.meminfo.company_id);
            if (res.data.meminfo == null || res.data.meminfo.role_id !== '3') {
              wx.showModal({
                title: '你没有邀请权限',
                content: '只有公司管理员，才能获得邀请VIP权限',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: -1
                    })
                  } else if (res.cancel) {
                    wx.navigateBack({
                      delta: -1
                    })
                  }
                }
              })
            } else {

            }
            wx.setStorage({
              key: 'xy_session',
              data: res.data.xy_session
            })

          }
        });
      }
    })
  },

  getVip: function (company_id) {
    var that = this;

    that.Util.network.POST({
      url: app.globalData.BASE_API_URL + "wechat/intapp/getVip",
      params: {
        xy_session: that.data.xy_session,
        company_id: company_id
      },
      success: res => {
        // 存储Session
        console.log(res.data);
        this.setData({
          vips: res.data
        })
      }
    })
  },

  Util: require('../../utils/util.js'),

  inviteSubmit: function (e) {
    var visitor_name = e.detail.value.visitor_name;
    this.Util.network.POST({
      url: app.globalData.BASE_API_URL + "wechat/intapp/isend",
      params: {
        xy_session: this.data.xy_session,
        visitor_name: visitor_name
      },
      success: res => {
        wx.redirectTo({
          url: '/pages/vip-share/vip-share?invitation_id=' + res.data.invitation_id,
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  openLocation: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }

})