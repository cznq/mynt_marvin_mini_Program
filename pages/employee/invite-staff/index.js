// pages/employee/invite-staff/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteModal: {
      showModal: false,
      inviteType: 'code'
    },
    qrcodeUrl: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/sample-qrcode.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 复制邀请码
   */
  copyInviteCode: function (e) {
    var that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success: function (res) {
        console.log(res);
        
      }
    })

  },

  /**
   * 打开邀请
   * method    code为邀请码方式，qrcode为二维码方式 
   */
  inviteOpen: function (e) {
    console.log(e);
    var method = e.currentTarget.dataset.method;
    this.setData({
      'inviteModal.showModal': true,
      'inviteModal.inviteType': method
    });
  },

  /**
   * 关闭弹出框
   */
  closeModal: function () {
    this.setData({
      'inviteModal.showModal': false
    });
  },

  /**
   * 
   */
  saveToLocal: function () {
    var self = this;
    wx.downloadFile({
      url: self.data.qrcodeUrl,
      success: function (ret) {
        var path = ret.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            });

          },
          fail: function (result) {}
        })
      }
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