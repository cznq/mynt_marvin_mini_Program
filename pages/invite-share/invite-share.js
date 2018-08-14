// pages/invite/invite.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    latitude: null,
    longitude: null,
    invitation_id: null,
    invitation: null,
    appointment_time: null,
    error: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      invitation_id: options.invitation_id
    })
    this.getInitation();
  },

  getInitation: function () {
    var that = this;
    console.log(that);
    if (that.data.invitation_id == undefined) {
      that.setData({
        error: "没有获取到邀请信息"
      })
    }
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          invitation_id: that.data.invitation_id
        })
      },
      success: res => {
        var invitation = res.data.result;
        var appointment_time = invitation.appointment_time + 8 * 3600;
        that.setData({
          invitation: invitation,
          appointment_time: app.Util.formatTime(appointment_time)
        })
        WxParse.wxParse('invitation_intro', 'html', invitation.invitation_intro, that, 5);
        WxParse.wxParse('invitation_note', 'html', invitation.invitation_note, that, 5);
        that.generateMap();
      },
      fail: res => {
        that.setData({
          error: "没有获取到邀请信息"
        })
      }
    })
  },

  generateMap: function () {
    var that = this;
    var qqmapsdk = new QQMapWX({
      key: 'CGVBZ-S2KHV-3CBPC-UP4JI-4N55F-7VBFU'
    });
    qqmapsdk.geocoder({
      address: that.data.invitation.address,
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '您收到访问邀请啦！',
      path: '/pages/invite-receive/invite-receive?invitation_id=' + this.data.invitation_id,
      success: function (res) {
        // 转发成功
        wx.navigateBack({
          delta: -1
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})