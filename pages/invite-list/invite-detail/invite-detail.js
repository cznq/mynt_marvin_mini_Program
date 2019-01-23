var app = getApp();
var toast = require('../../../templates/showToast/showToast');
var utils = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation_id:"",
    invitation_intro:"",//邀请描述
    employee_name:"",//邀请人姓名
    appointment_time:"",//预约的时间

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (options.invitation_id) {
      _this.setData({
        invitation_id:options.invitation_id
      })
      _this.get_invitation_info(_this, this.data.invitation_id, _this.set_all_Data);
    }
  },
  //获取邀请信息
  get_invitation_info: function(_this,invitation_id,callback) {
      app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
              service: 'visitor',
              method: 'get_invitation_info',
              data: JSON.stringify({
                invitation_id:invitation_id
              })
          },
          success: res => {
            console.log('响应invitation_id:',res);
            let data = res.data;
            if (data.result && data.return_code ==="SUCCESS") {
              callback && callback(data.result)
            }
          },
          fail: res => {
              console.log('fail');
          }
      })
  },
  set_all_Data:function(data) {
    console.log('data2222',data);
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
