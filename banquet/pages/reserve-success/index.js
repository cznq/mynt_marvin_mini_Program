// banquet/pages/reserve-success/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    route: '',
    pay: false,
    status: '',
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
    if (options.status && options.need_invoice && options.book_id) { //支付状态及发票状态
      this.setData({
        status: options.status,
        need_invoice: options.need_invoice,
        book_id: options.book_id
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
          url: '../orderDetail/orderDetail?bookid=' + this.data.orderInfo.book_id + '&router=' + 'reserve'
        })
        break;
      case 'pay':
        const pages = getCurrentPages();
        const currPage = pages[pages.length - 1];
        const prevPage = pages[pages.length - 2];
        prevPage.setData({
          statusPage: true,
          book_id: this.data.book_id
        })
        wx.navigateBack({
          delta: 1
        })
        break;
      case 'invoice':
        wx.redirectTo({
          url: '../orderDetail/orderDetail?router=' + 'invoice' + '&bookid=' + this.data.book_id
        })
        break;
        // default:
        //   break;
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