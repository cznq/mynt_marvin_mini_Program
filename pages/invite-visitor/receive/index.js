
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
    vip: null,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      invitation_id: options.invitation_id,
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
        if (app.Util.checkEmpty(res.data.result.visitor.input_pic_url)) {
          that.setData({
            continuevideo: true
          })
        }
        if (res.data.result.role == 3) {
          that.setData({
            role: "管理员"
          })
        } else if (res.data.result.role == 2) {
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

  getReadyParam: function (e) {
    console.log(e);
  },

  onShow: function () {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getInitation();
      })
    } else {
      that.getInitation();
    }

  }

})