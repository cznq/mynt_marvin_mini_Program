// pages/invite/invite.js
var util = require('../../utils/util.js');
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
    vip: null,
    visitor_id: null,
    base_url: app.globalData.BASE_API_URL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.vip !== "yes") {
      options.vip = null
    }
    that.setData({
      visitor_id: options.visitor_id,
      invitation_id: options.invitation_id,
      vip: options.vip
    })
    that.getInitation();
  },

  Util: require('../../utils/util.js'),

  getInitation: function () {
    var that = this;
    var invitationId = that.data.invitation_id;
    var unionId = app.globalData.xy_session;
    that.Util.network.POST({
      url: app.globalData.BASE_API_URL,

      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        union_id: unionId,
        data: JSON.stringify({
          invitation_id: invitationId,
        })
      },
      success: res => {
        that.setData({
          invitation: invitation,
        })

        wx.redirectTo({
          url: '/pages/invite-accept/invite-accept?invitation_id=' + invitationId,
        })
      }
    })
  },

})