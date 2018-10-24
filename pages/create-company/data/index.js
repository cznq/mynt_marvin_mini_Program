// pages/create-company/company-code/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '上传企业资料',
    button_text: '提交',
    hint: '以下资料需经过楼宇管理员审核，严禁上传色情、\n暴力、血腥、骇人或政治相关内容的图片'
  },
  next: function () {
    wx.navigateTo({
      url: '../success/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onShareAppMessage: function () {

  }
})