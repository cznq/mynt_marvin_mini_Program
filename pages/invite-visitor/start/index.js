const app = getApp();
Page({

  /**
   * 页面的初始数据
   * serviceStatus   tried 试用；closed 关闭；opened 开通；
   */

  data: {
    serviceStatus: 'closed'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        app.getServiceStatus(that, 'INVITE_VISITOR');
      })
    } else {
      app.getServiceStatus(that, 'INVITE_VISITOR');
    }
  },

  goToInvite: function () {
    wx.navigateTo({
      url: '/pages/invite-visitor/edit/index',
    })
  },

  /**
   * 了解小觅商业服务套件
   */
  viewBusinessService() {
    app.viewBusinessService();
  }

})