// banquet/pages/reserve-success/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    route: '',
    pay: false,
    stepOne: true,
    stepTwo: false,
    stepThree: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.params) {
      var params = JSON.parse(options.params);
      this.setData({
        orderInfo: params
      })
    }

    this.setData({ //获取来源
      route: options.router
    })
  },
  backPage() {
    switch (this.data.route) {
      case 'reserve':
        wx.redirectTo({
          url: '../orderDetail/orderDetail?router=' + 'reserve'
        })
        break;
      case 'pay':
        wx.redirectTo({
          url: '../orderDetail/orderDetail?router=' + 'pay'
        })
        break;
      case 'invoice':
        wx.redirectTo({
          url: '../orderDetail/orderDetail?router=' + 'invoice'
        })
        break;
      default:
        break;
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})