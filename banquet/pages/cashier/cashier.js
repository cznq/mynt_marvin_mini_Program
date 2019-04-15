// banquet/pages/cashier/cashier.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invSwitch: false,
    bankAccount: "", //银行账号
    bankName: "", //银行名称
    companyAddress: "", //单位地址
    errMsg: "",
    taxNumber: "", //抬头税号
    telephone: "", //手机号码
    title: "", //抬头名称
    type: 0 //0 单位 1 个人
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  chooseInvoece() {
    let _that = this;
    wx.chooseInvoiceTitle({
      success(res) {
        console.log('res:', res);
        _that.setData({
          title: res.title,
          taxNumber: res.taxNumber,
          bankAccount: res.bankAccount,
          bankName: res.bankName,
          type: res.type,
          telephone: res.telephone,
          companyAddress: res.companyAddress,
          invSwitch: true
        })

      },
      fail(res) {
        wx.showToast({
          title: res,
          icon: 'none'
        })
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