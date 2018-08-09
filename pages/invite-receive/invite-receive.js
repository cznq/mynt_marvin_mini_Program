// pages/invite/invite.js
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
    visitor: null,
    vip: null,
    xy_session: null,
    web_url: app.globalData.WEB_VIEW_URL
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
      invitation_id: options.invitation_id,
      vip: options.vip,
      xy_session: wx.getStorageSync('xy_session')
    })
    that.getInitation(); 
    that.viewInvitation();
  },

  viewInvitation: function () {
    var that = this;
    var invitationId = that.data.invitation_id;
    var unionId = that.data.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'update_Invitation',
        union_id: unionId,
        data: JSON.stringify({
          invitation_id: invitationId,
          read_status: 1
        })
      },
      success: res => {
        console.log(res);
      }
    })
  },

  getInitation: function () {
    var that = this;
    var invitationId = that.data.invitation_id;
    var unionId = that.data.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        union_id: unionId,
        data: JSON.stringify({
          invitation_id: invitationId
        })
      },
      success: res => {
        console.log(res.data.result);
        that.setData({
          invitation: res.data.result,
        })
        that.getVisitorinfo();
      }
    })
  },

  getVisitorinfo: function() {
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
        if (that.data.invitation.visitor_id !== 0) {
          if (res.data.sub_code == 0) {
            that.setData({
              visitor: res.data.result
            })
            if (res.data.result.id_number == "" || res.data.result.id_number == null) {
              wx.redirectTo({
                url: '/pages/edit-info/edit-info?invitation_id=' + that.data.invitation_id + '&vip=' + that.data.vip,
              })
            } else if (res.data.result.input_pic_url == "" || res.data.result.input_pic_url == null) {
              wx.redirectTo({
                url: '/pages/invite-accept/invite-accept?invitation_id=' + that.data.invitation_id + '&vip=' + that.data.vip,
              })
            } else {
              wx.redirectTo({
                url: '/pages/invite-success/invite-success?invitation_id=' + that.data.invitation_id + '&vip=' + that.data.vip,
              })
            }
          } 
        } 
      }

    })
  }

})