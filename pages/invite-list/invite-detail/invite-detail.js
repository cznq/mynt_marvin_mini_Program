var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  inviteVisitor:function () {
    wx.navigateTo({
      url:'../../invite-visitor/success/index'
    })
  },
  deleBtn:function(){
    toast.showToast(this, {
      toastStyle: 'toast6',
      title: '确定要删除邀请人Leo Zhu吗？',
      mask: true,
      isSure: true,
      sureText: '确定',
      isClose: true,
      closeText: '取消'
    });

  },
  //取消关闭弹层
  bindToastClose: function () {
    toast.hideToast();
  },

  //确定关闭弹层
  bindToastSure: function () {
    toast.hideToast(this, {
      cb: function () {
        console.log(333);
      }
    });
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
