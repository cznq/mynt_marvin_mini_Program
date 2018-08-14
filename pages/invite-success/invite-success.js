// pages/invite/invite.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xy_session: null,
    visitor: null,
    latitude: null,
    longitude: null,
    address: null,
    invitation_id: null,
    vip: null,
    invitation: null,
    continuevideo: false,
    appointment_time: null,
    role: null,
    error: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      invitation_id: options.invitation_id,
      vip: options.vip,
      xy_session: wx.getStorageSync('xy_session')
    })
  },

  goShot: function () {
    wx.navigateTo({
      url: '/pages/invite-accept/invite-accept?vip=' + this.data.vip + '&invitation_id=' + this.data.invitation_id,
    })
  },

  getInitation: function () {
    var that = this;
    if (that.data.invitation_id == undefined) {
      that.setData({
        error: "没有获取到邀请信息"
      })
    }
    var unionId = that.data.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        union_id: unionId,
        data: JSON.stringify({
          invitation_id: that.data.invitation_id,
        })
      },
      success: res => {
        if (res.data.result.role==3){
          that.setData({
            role: "管理员"
          })
        } else if (res.data.result.role==2){
          that.setData({
            role: "前台"
          })
        } else if (res.data.result.role == 1) {
          that.setData({
            role: "普通员工"
          })
        }
        that.setData({
          invitation: res.data.result,
          appointment_time: app.Util.formatTime(res.data.result.appointment_time)
        })
        WxParse.wxParse('invitation_intro', 'html', res.data.result.invitation_intro, that, 5);
        WxParse.wxParse('invitation_note', 'html', res.data.result.invitation_note, that, 5);
        this.generateMap();
        this.getVisitorinfo();
      },
      fail: res => {
        that.setData({
          error: "没有获取到邀请信息"
        })
      }
    })
  },

  getVisitorinfo: function () {
    var that = this;
    var unionId = that.data.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_visitor_info',
        union_id: unionId,
        data: JSON.stringify({

        })
      },
      success: res => {
        that.setData({
          visitor: res.data.result,
        })
        if (res.data.result.input_pic_url == "" || res.data.result.input_pic_url == null) {
          that.setData({
            continuevideo: true,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.mapCtx = wx.createMapContext('myMap');
    that.mapCtx.moveToLocation();
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
    this.getInitation();
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.onLaunch();
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
    
  }
})