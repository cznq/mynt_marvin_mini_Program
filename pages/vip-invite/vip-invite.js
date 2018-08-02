
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xy_session: null,
    invite_auth: null,
    formready: false,
    input1: false,
    error: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      invite_auth: app.globalData.invite_auth
    })
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
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        visitor_name: visitor_name
      },
      success: res => {
        wx.redirectTo({
          url: '/pages/vip-share/vip-share?invitation_id=' + res.data.result.invitation_id,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  openLocation: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }

})