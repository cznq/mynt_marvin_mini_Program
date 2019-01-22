
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
    hasAccept: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.invitation_id = options.invitation_id;
    this.getInitation(this);
    
  },

  getInitation(_this) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        data: JSON.stringify({
          invitation_id: _this.data.invitation_id,
        })
      },
      success: res => {
        if (res.data.result) {
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#007BFF'
          })
          if (res.data.result.visitor.visitor_id != 0) {
            _this.setData({ hasAccept: true })
          } 
          _this.setData({
            invitation: res.data.result,
            appointment_time: app.Util.formatTime(res.data.result.appointment_time + 8 * 3600)
          })
          app.Util.generateMap(_this, res.data.result.company.address);
        } else {
          wx.showToast({
            title: '获取邀请失败',
            icon: 'none'
          })
        }
        
      },
      fail: res => {
        wx.showToast({
          title: '获取邀请失败',
          icon: 'none'
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
  }

})