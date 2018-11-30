
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitor: null,
    latitude: null,
    longitude: null,
    address: null,
    invitation_id: null,
    vip: null,
    invitation: null,
    company_id: null,
    continuevideo: false,
    appointment_time: null,
    error: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      invitation_id: options.invitation_id,
      company_id: options.company_id,
      vip: options.vip
    })
  },

  getInitation: function () {
    var that = this;
    if (that.data.invitation_id == undefined) {
      that.setData({
        error: "没有获取到邀请信息"
      })
    }
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        data: JSON.stringify({
          union_id: unionId,
          invitation_id: that.data.invitation_id,
        })
      },
      success: res => {
        that.setData({
          invitation: res.data.result,
          appointment_time: app.Util.formatTime(res.data.result.appointment_time + 8 * 3600)
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
   * 如何试用邀请函
   */
  viewGuide: function () {
    wx.navigateTo({
      url: '/pages/invite-visitor/guide/index'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getInitation();
      })
    } else {
      that.getInitation();
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.onLaunch();
  }

})