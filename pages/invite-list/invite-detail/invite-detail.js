var app = getApp();
var toast = require('../../../templates/showToast/showToast');
var utils = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation_id: "",
    invitation_intro: "", //邀请描述
    appointment_time: "", //预约的时间
    employee_name: "", //邀请人姓名
    avatar: "",
    visitor_name: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    if (options.invitation_id) {
      _this.setData({
        invitation_id: options.invitation_id
      })
      _this.get_invitation_info(_this, this.data.invitation_id, _this.set_all_Data);
    }
  },
  //获取邀请信息
  get_invitation_info: function(_this, invitation_id, callback) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        data: JSON.stringify({
          invitation_id: invitation_id
        })
      },
      success: res => {
        // console.log('响应invitation_id:',res);
        let data = res.data;
        if (data.result && data.return_code === "SUCCESS") {
          callback && callback(data.result)
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  set_all_Data: function(data) {
    let appointment_time = utils.formatTime(data.appointment_time)
    this.setData({
      invitation_intro: data.invitation_intro, //邀请描述
      appointment_time: appointment_time, //预约的时间
      employee_name: data.employee_name, //邀请人姓名
      visitor_name: data.visitor.visitor_name,
      avatar: data.visitor.avatar,
    })
  },
  inviteVisitor: function() {
    wx.navigateTo({
      url: '../../invite-visitor/detail/index?' + 'invitation_id' + '=' + this.data.invitation_id
    })
  },
  deleBtn: function() {
    toast.showToast(this, {
      toastStyle: 'toast6',
      title: '确定要删除邀请人' + this.data.visitor_name + '吗？',
      mask: true,
      isSure: true,
      sureText: '确定',
      isClose: true,
      closeText: '取消'
    });

  },
  //取消关闭弹层
  bindToastClose: function() {
    toast.hideToast();
  },

  //确定关闭弹层
  bindToastSure: function() {
    let _this = this;
    toast.hideToast(this, {
      cb: function() {
        _this.update_invitation_status(_this);
      }
    });
  },
  //获取邀请信息
  update_invitation_status: function(_this) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'update_invitation_status',
        data: JSON.stringify({
          invitation_id: _this.data.invitation_id
        })
      },
      success: res => {
        if (res.data.sub_code === 0) {
          wx.redirectTo({
            url: '../index/index',
            success: () => {
              toast.showToast(_this, {
                toastStyle: 'toast',
                title: '删除成功',
                duration: 1500,
                mask: false
              });
            }
          })

        }
      },
      fail: res => {
        console.log('fail');
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