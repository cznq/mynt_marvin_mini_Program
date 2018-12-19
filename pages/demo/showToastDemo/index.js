var toast = require('../../../templates/showToast/showToast');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  bindToastOpen8: function () {
    toast.showToast(this, {
      toastStyle: 'toast errorwrap',
      title: '你输入的码有误你输入的码有误你输入的码有误你输入的码有误你输入的码有误',
      duration: 100000,
      mask: false,
      isArrow: true
    });
  },
  bindToastOpen1: function () {
    toast.showToast(this, {
      toastStyle: 'toast',
      title: '你输入的码有误,请重新输入',
      duration: 1500,
      mask:false
    });
  },
  bindToastOpen2: function () {
    toast.showToast(this, {
      toastStyle: 'toast2',
      title: '提交成功',
      introduce: '上传资料的审核结果会在24小时内反馈,请注意查看公众号-我的消息中的反馈信息',
      mask: true,
      isSure: true,
      sureText: '好的'
    });
  },
  bindToastOpen3: function () {
    toast.showToast(this, {
      toastStyle: 'toast3',
      title: '宣传视频',
      introduce: '为了更好的增加用户体验 目前该功能限时免费体验 ',
      mask: true,
      isSure: true,
      sureText: '限时免费体验',
      isClose: true,
      closeText: '取消'
    });
  },
  bindToastOpen4: function () {
    toast.showToast(this, {
      toastStyle: 'toast4',
      title: 'Unattended tips',
      introduce: 'After opening this function, visitors can arrive at your company without application. Please open cautiously.',
      mask: true,
      isSure: true,
      sureText: 'Still opening',
      isClose: true,
      closeText: 'Cancel'
    });
  },
  bindToastOpen5: function () {
    toast.showToast(this, {
      toastStyle: 'toast5',
      title: '您还没有人脸信息，无法开启员工取卡，请前往录入。',
      mask: true,
      isSure: true,
      sureText: '前往录入',
      isClose: true,
      closeText: '取消'
    });
  },

  bindToastOpen6: function () {
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
  bindToastOpen7: function () {
    toast.showToast(this, {
      toastStyle: 'toast4 toast7',
      title: 'Mark as unpopular',
      introduce:'After marking, he will no longer be able to visit your company voluntarily through the robot, you can also cancel the marking.',
      pic: 'http://www.ygyhtrans.com/Public/images/about_img.jpg',
      mask: true,
      isSure: true,
      sureText: 'Still marking',
      isClose: true,
      closeText: 'Cancel'
    });
  },

  //取消关闭弹层
  bindToastClose: function () {
    toast.hideToast();
  },

  //确定关闭弹层
  bindToastSure: function () {
    toast.hideToast(this, {
      // cb: function () {
      //   wx.navigateTo({
      //     url: '../fontface/fontface',
      //   })
      // }
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