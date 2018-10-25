var menu = require('../../../templates/showMenu/showMenu');
var toast = require('../../../templates/showToast/showToast');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noneStaff: false
  },

  /**
   * 员工列表点击编辑
   */
  editEmp: function (e) {
    console.log(e);
    menu.showMenu(this, {
      menuList: ['从列表删除', '加入列表'],
      topPos: e.target.offsetTop + 30 + 'px',
      lrPos: 60 + 'rpx',
      isLeft: false,
      mask: true,
      bindFun: 'removeStaff'
    });
  },

  /**
   * 删除员工
   */
  removeStaff: function () {
    var self = this;
    menu.hideMenu();
    toast.showToast(this, {
      toastStyle: 'toast6',
      title: '确定要将' + self.data.removeData  + '从团队删除吗？',
      introduce: '',
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
      // cb: function () {
      //   wx.navigateTo({
      //     url: '../fontface/fontface',
      //   })
      // }
    });
  },

  hideToastMenu: function () {
    console.log('log');
    menu.hideMenu();
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