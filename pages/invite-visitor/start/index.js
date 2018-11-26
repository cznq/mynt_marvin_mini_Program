const app = getApp();
Page({

  /**
   * 页面的初始数据
   * inviteAuth   tried 试用；closed 试用结束；opened 开通；
   */
  
  data: {
    inviteAuth: 'opened'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getServiceStatus();
      })
    } else {
      that.getServiceStatus();
    }
  },

  getServiceStatus: function () {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_company_service_status',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          service_key: 'INVITE_VISITOR'
        })
      },
      success: res => {
        console.log(res.data);
      },
      fail: res => {
      
      }
    })
  },

  goToInvite: function () {
    wx.navigateTo({
      url: '/pages/invite-visitor/edit/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})