
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    latitude: null,
    longitude: null,
    invitation_id: null    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.invitation_id = options.invitation_id;
  },

  getInitation: function () {
    var that = this;
    if (that.data.invitation_id == undefined) {
      wx.showToast({
        title: '没有获取到邀请信息',
        icon: 'none'
      })
    }
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: that.data.invitation_id
        })
      },
      success: res => {
        if(!res.data.result) {
          wx.showToast({
            title: '没有获取到邀请信息',
            icon: 'none'
          })
        }
        if (res.data.result.visitor.visitor_id !== 0) {
          wx.redirectTo({
            url: '/pages/invite-visitor/success/index?invitation_id=' + that.data.invitation_id,
          })
        } else {
          that.setData({
            invitation: res.data.result,
            appointment_time: app.Util.formatTime(res.data.result.appointment_time + 8 * 3600)
          })
          app.Util.generateMap(that, res.data.result.company.address);
        }
      },
      fail: res => {
        wx.showToast({
          title: '没有获取到邀请信息',
          icon: 'none'
        })
      }
    })
  },

  receiveSubmit(e) {
    var that = this;
    var params = {
      invitation_id: that.data.invitation_id,
      form_id: e.detail.formId,
      company_id: that.data.invitation.company.company_id
    }
    app.checkHasRecodeFace('visitor', function(res){
      if (res == '') {
        wx.navigateTo({
          url: '/pages/collect-info/guide/index?source=invite&params=' + JSON.stringify(params),
        })
      } else {
        app.receiveSubmit(that.data.invitation_id, e.detail.formId, function () {
          wx.redirectTo({
            url: '/pages/invite-visitor/success/index?invitation_id=' + that.data.invitation_id,
          })
        }) 
      }
      
    }) 
    

  },

  onShow: function () {
    this.getInitation();
  }

})