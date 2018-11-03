
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteVip_auth: null,
    formready: false,
    input1: false,
    error: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.checkInviteAuth();
      })
    } else {
      that.checkInviteAuth();
    }

  },

  checkInviteAuth: function() {
    var inviteVip_auth = wx.getStorageSync('invite_auth');
    if (inviteVip_auth == false) {
      wx.showModal({
        title: '你没有邀请权限',
        content: '请先加入成为公司管理员，才能获得邀请权限',
        showCancel: false,
        success: function (res) {}
      })
    }
  },

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
    var appointment_time = Math.round(new Date().getTime() / 1000 - 28800);
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'invite',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          visitor_name: visitor_name,
          invitation_type: 1,
          introduction: '',
          note: '',
          appointment_time: appointment_time
        })
      },
      success: res => {
        wx.redirectTo({
          url: '/pages/vip-share/vip-share?invitation_id=' + res.data.result.invitation_id,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.removeStorageSync('xy_session');
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.checkInviteAuth();
      })
    } else {
      that.checkInviteAuth();
    }
  }

})