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
    base_url: app.globalData.BASE_URL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.vip !== "yes") { options.vip = null }
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
    that.Util.network.POST({
      url: app.globalData.BASE_URL + "wechat/intapp/invitation",
      params: {
        xy_session: app.globalData.xy_session,
        invitation_id: that.data.invitation_id
      },
      success: res => {
        console.log(res.data);
        that.setData({
          invitation: res.data,
        })
        
        if (res.data.visitor_id !== null && res.data.id !== null && res.data.is_deleted == 0){
          if(res.data.id_sign == 3 || res.data.phone !== null) {
            if(res.data.input_pic==null){
              wx.redirectTo({
                url: '/pages/invite-accept/invite-accept?invitation_id=' + that.data.invitation_id + '&vip=' + that.data.vip,
              })
            }else{
              wx.redirectTo({
                url: '/pages/invite-success/invite-success?invitation_id=' + that.data.invitation_id + '&vip=' + that.data.vip,
              })
            }

          } else {
            wx.redirectTo({
              url: '/pages/edit-info/edit-info?invitation_id=' + that.data.invitation_id + '&vip=' + that.data.vip + '&visitor_id=' + that.data.visitor_id,
            })
          }
          
        }
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    
  }
})