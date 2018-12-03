const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    route: '',
    opt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.route = options.route
    this.data.opt = options.opt
    console.log(JSON.parse(this.data.route));
    console.log(JSON.parse(this.data.opt));
  },

  bindGetUserInfo: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.setData({
                showLoginModal: false
              })
              app.authorizeLogin(res.encryptedData, res.iv, () => {
                wx.redirectTo({
                  url: that.data.route + '&opt=' + opt,
                })
                
              });
            }
          })
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.checkSession()) {
      wx.redirectTo({
        url: this.data.route + '&opt=' + opt,
      })
    }
  }


})