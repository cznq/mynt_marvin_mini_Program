
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
    meminfo: null,
    formready: false,
    input1: false,
    error: ""
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
        this.serverLogin();
      }
    })
  },

  serverLogin: function () {
    // 登录请求
    this.Util.network.POST({
      url: app.globalData.BASE_URL + "wechat/intapp/login",
      params: {
        js_code: this.data.js_code
      },
      success: res => {
        // 存储Sessionc
        this.setData({
          xy_session: res.data.xy_session,
          meminfo: res.data.meminfo
        })

        if (res.data.meminfo == null || res.data.meminfo.role_id == 0) {
          this.setData({
            error: "没有邀请权限"
          })
          wx.showModal({
            title: '你没有邀请权限',
            content: '请先加入成为公司员工，才能获得邀请权限',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
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
  },

  Util: require('../../utils/util.js'),

  checkForm: function (e) {

    if (e.detail.value !== '' && e.currentTarget.id == 's1') {
      this.setData({
        input1: true
      });
    } 
    if (this.data.input1) {
      this.setData({
        formready: true
      });
    }
  },

  inviteSubmit: function (e) {
    var visitor_name = e.detail.value.visitor_name;
    this.Util.network.POST({
      url: app.globalData.BASE_URL + "wechat/intapp/isend",
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