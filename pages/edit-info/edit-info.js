// pages/edit-info/edit-info.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    xy_session: null,
    invitation_id: null,
    vip: null,
    showkbd: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      invitation_id: options.invitation_id,
      vip: options.vip,
      xy_session: wx.getStorageSync('xy_session')
    })
  },

  editSubmit: function (e) {
    var id_type = 0;
    var phone = e.detail.value.phone;
    var id_number = e.detail.value.id_number;
    var idcard_reg = app.Util.checkID(id_number) || app.Util.checkPassport(id_number);
    if (app.Util.checkID(id_number)) {
      var id_type = 0;
    } else if (app.Util.checkPassport(id_number)) {
      var id_type = 1;
    }
    var phone_reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
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
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'visitor',
          method: 'bind',
          union_id: wx.getStorageSync('xy_session'),
          data: JSON.stringify({
            id_type: id_type,
            phone: phone,
            id_number: id_number
          })
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

  getVisitorinfo: function () {
    var that = this;
    var unionId = that.data.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_visitor_info',
        union_id: unionId,
        data: JSON.stringify({})
      },
      success: res => {
        if (res.data.result.id_number !== "" && res.data.result.id_number !== null) {
          wx.redirectTo({
            url: '/pages/invite-accept/invite-accept?invitation_id=' + that.data.invitation_id + '&vip=' + that.data.vip,
          })
        }

      }
    })
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
    this.getVisitorinfo();
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