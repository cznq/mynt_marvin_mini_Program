
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
    role: null,
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

  goShot: function () {
    wx.navigateTo({
      url: '/pages/collect-info/face/index?vip=' + this.data.vip + '&invitation_id=' + '&company_id=' + this.data.company_id,
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
        if (app.Util.checkEmpty(res.data.result.visitor.input_pic_url)) {
          that.setData({
            continuevideo: true
          })
        }
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