// pages/employee/senior-executive/receive/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    version: app.globalData.version,
    invitation_id: null,
    visit_company_id: null ,
    invitation:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      invitation_id:options.invitation_id
    })
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
        service: 'company',
        method: 'get_role_invitation_info',
        data: JSON.stringify({
          invitation_id: that.data.invitation_id,
          invitation_type:0
        })
      },
      success: res => {
        if(!res.data.result) {
          wx.showToast({
            title: '没有获取到邀请信息',
            icon: 'none'
          })
        }
        console.log(res.data.result)
        that.setData({
          invitation: res.data.result,
        })
      },
      fail: res => {
        wx.showToast({
          title: '没有获取到邀请信息',
          icon: 'none'
        })
      }
    })
  },
 //更改邀请函阅读状态
 changeReadStatus() {
  var that = this;
  app.Util.network.POST({
    url: app.globalData.BASE_API_URL,
    params: {
      service: 'visitor',
      method: 'update_Invitation',
      data: JSON.stringify({
        union_id: wx.getStorageSync('xy_session'),
        invitation_id: that.data.invitation_id,
        read_status: 1
      })
    },
    success: res => {},
    fail: res => {}
  })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInitation();
  },


})