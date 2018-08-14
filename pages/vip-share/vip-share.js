// pages/invite/invite.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation_id: null,
    invitation: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      invitation_id: options.invitation_id
    })
    this.getInitation();

  },

  getInitation: function () {
    var that = this;
    if (that.data.invitation_id == undefined) {
      that.setData({
        error: "没有获取到邀请信息"
      })
    }
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          invitation_id: that.data.invitation_id
        })
      },
      success: res => {
        that.setData({
          invitation: res.data.result
        })
      },
      fail: res => {
        
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
    return {
      title: '您收到VIP邀请啦！',
      path: '/pages/invite-receive/invite-receive?vip=yes&invitation_id=' + this.data.invitation_id,
      success: function (res) {
        // 转发成功
        wx.navigateBack({
          delta: -1
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})