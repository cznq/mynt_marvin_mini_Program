
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    isIphoneX: app.globalData.isIphoneX,
    latitude: null,
    longitude: null,
    invitation_id: null,
    invitation: null,
    appointment_time: '',
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
   
    that.getInitation();

  },

  /**
   * 获取邀请信息
   */
  getInitation: function () {
    var that = this;
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
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
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
        app.Util.generateMap(that, res.data.result.company.address);
      },
      fail: res => {
        that.setData({
          error: "没有获取到邀请信息"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('address-map');
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '您收到访问邀请啦！',
      path: '/pages/invite-visitor/receive/index?invitation_id=' + this.data.invitation_id,
      success: function (res) {
        // 转发成功
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})