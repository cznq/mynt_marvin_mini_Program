// pages/businessDining/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTitle: 'all'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  touchTit: function(e) {
    console.log(e);
    let tag = e.currentTarget.dataset.tag;
    switch (tag) {
      case "all":
        this.setData({
          orderTitle: "all"
        });
        break;
      case "reConfirm":
        this.setData({
          'orderTitle': "reConfirm"
        });
        break;
      case "reCost":
        this.setData({
          orderTitle: "reCost"
        });

        break;
      case "rePay":
        this.setData({
          orderTitle: "rePay"

        });

        break;
      default:
        console.log('无效的选择');
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