var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noneData: {
      orderList: [],
      textInfo: '暂无交易记录',
      buttonText: '',
      emptyBtnFunc: '',
      show: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderRecord(this)
  },

  getOrderRecord: function(that) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'pay',
        method: 'get_order_record',
        data: JSON.stringify({}),
      },
      success: res => {
        console.log("获取订单记录:", res);
        if (res.data.return_code === "SUCCESS") {
          let data = res.data.result
          that.setData({
            orderList: data
          })
        }
      }
    })
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