// pages/invite/invite.js
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
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
    visit_time: null,
    error: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //console.log(options);
    that.setData({
      invitation_id: options.invitation_id
    }) 
    this.getInitation();
    
  },

  Util: require('../../utils/util.js'),

  getInitation: function () {
    var that = this;
    if (that.data.invitation_id == undefined) {
      that.setData({
        error: "没有获取到邀请信息"
      })
    }
    that.Util.network.POST({
      url: app.globalData.BASE_URL + "wechat/intapp/invitation",
      params: {
        xy_session: app.globalData.xy_session,
        invitation_id: that.data.invitation_id
      },
      success: res => {
        console.log(res.data);
        that.setData({
          invitation: res.data,
          visit_time: that.Util.formatTime(res.data.visit_time)
        })
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
      path: '/pages/invite-receive/invite-receive?invitation_id='+this.data.invitation_id,
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