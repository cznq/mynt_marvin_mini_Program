// pages/edit-info/edit-info.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xy_session: null,
    visitor_id: null,
    invitation_id: null,
    vip: null,
    showkbd: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      visitor_id: options.visitor_id,
      invitation_id: options.invitation_id,
      vip: options.vip
    })

  },

  Util: require('../../utils/util.js'),

  editSubmit: function (e) {
    var id_type = 0;
    var phone = e.detail.value.phone;
    var id_number = e.detail.value.id_number;
    var idcard_reg = this.Util.checkID(id_number) || this.Util.checkPassport(id_number);
    if (this.Util.checkID(id_number)) {
      var id_type = 0;
    } else if (this.Util.checkPassport(id_number)) {
      var id_type = 1;
    }
    var phone_reg = /^1[3|4|5|7|8][0-9]{9}$/;
    if (phone_reg.test(phone) === false) {
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false
      })
    } else if (idcard_reg === false) {
      wx.showModal({
        content: '请输入有效的证件号',
        showCancel: false
      })
    } else {
      this.Util.network.POST({
        url: app.globalData.BASE_URL + "wechat/intapp/add_visitor_info",
        params: {
          xy_session: this.data.xy_session,
          visitor_id: this.data.visitor_id,
          id_type: id_type,
          phone: phone,
          id_number: id_number
        },
        success: res => {
          if(res.data.msg == 'success') {
            wx.redirectTo({
              url: '/pages/invite-accept/invite-accept?invitation_id=' + this.data.invitation_id +'&vip=' + this.data.vip,
            })
          } else {
            wx.showModal({
              content: '不要重复提交',
              showCancel: false
            })
            wx.redirectTo({
              url: '/pages/invite-accept/invite-accept?invitation_id=' + this.data.invitation_id + '&vip=' + this.data.vip,
            })
          }
          
        }
      })
    }

  },

  showKeyboard: function() {
    this.setData({
      showkbd: "fixed"
    })
  }, 
  
  hideKeyboard: function() {
    this.setData({
      showkbd: null
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