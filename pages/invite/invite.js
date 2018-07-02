// pages/invite/invite.js
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
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
    latitude: null,
    longitude: null,
    userInfo: null,
    meminfo: null,
    date: "",
    time: "",
    formready: false,
    input1: false,
    input2: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    that.setData({
      date: util.getDate(),
      time: util.getTime()
    })
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
          url: app.globalData.BASE_URL + "wechat/intapp/login",
          params: {
            js_code: this.data.js_code,
            encryptedData: res.encryptedData,
            iv: encodeURIComponent(res.iv)
          },
          success: res => {
            // 存储Sessionc
            console.log(res.data.meminfo);
            this.setData({
              xy_session: res.data.xy_session,
              meminfo: res.data.meminfo
            })
            
            if (res.data.meminfo == null) {
              wx.showModal({
                title: '你没有邀请权限',
                content: '请先加入成为公司员工，才能获得邀请权限',
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
              this.generateMap(res.data.meminfo.address);
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

  generateMap: function (address) {
    var that = this;
    var qqmapsdk = new QQMapWX({
      key: 'CGVBZ-S2KHV-3CBPC-UP4JI-4N55F-7VBFU'
    });
    qqmapsdk.geocoder({
      address: address,
      success: function (res) {
        that.setData({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },

  Util: require('../../utils/util.js'),

  checkForm: function(e) {

    if(e.detail.value!=='' && e.currentTarget.id=='i1'){
      this.setData({
        input1: true
      });
    } if (e.detail.value !== '' && e.currentTarget.id == 'i2') {
      this.setData({
        input2: true
      });
    } if (this.data.input1 && this.data.input2){
      this.setData({
        formready: true
      });
    }
  },

  inviteSubmit: function (e) {
    var visit_time = e.detail.value.visit_time;
    var visitor_name = e.detail.value.visitor_name;
    var mark = e.detail.value.mark;
    var visit_intro = e.detail.value.visit_intro;
    this.Util.network.POST({
      url: app.globalData.BASE_URL + "wechat/intapp/isend",
      params: {
        xy_session: this.data.xy_session,
        visit_time: visit_time,
        visitor_name: visitor_name,
        mark: mark,
        visit_intro: visit_intro
      },
      success: res => {
        wx.redirectTo({
          url: '/pages/invite-share/invite-share?invitation_id=' + res.data.invitation_id,
        })
      }
    })
    
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
   
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    this.mapCtx = wx.createMapContext('myMap');
    this.mapCtx.moveToLocation();
  },

  openLocation: function () {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 28
    })
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
   this.onload();
  }

})