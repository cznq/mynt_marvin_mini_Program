// pages/invite-accept-info/invite-accept-info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation_id: null,
    vip: null,
    company_id: null,
    visit_apply_id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      invitation_id: options.invitation_id,
      vip: options.vip,
      company_id: options.company_id,
      visit_apply_id: options.visit_apply_id
    })
  },

  startRecord: function() {
    wx.redirectTo({
      url: '/pages/invite-accept/invite-accept?invitation_id=' + this.data.invitation_id + '&visit_apply_id=' + this.data.visit_apply_id + '&company_id=' + this.data.company_id + '&vip=' + this.data.vip,
    })
  }

})