// pages/employee/senior-executive/bossShare/index.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    version: app.globalData.version,
    companyInfo:'',
    inviterInfo:{},
    bossName:'',
    empInfo:'',
    shareBtn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    var params = JSON.parse(options.params);
    that.setData({
      inviterInfo:params
    })
    this.getCompanyInfo();
  },
  getCompanyInfo: function () {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        //console.log(res.data);
        if (res.data.result) {
          that.setData({
            companyInfo: res.data.result
          })
        }      
        this.getEmployeeInfo();
      }
    })
  },
  // 获取员工信息
  getEmployeeInfo:function(){
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        //console.log(res.data);
        if (res.data.result) {
          that.setData({
            empInfo: res.data.result
          })
        }
        //提交邀请函
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'company',
            method: 'role_invitation_record',
            data: JSON.stringify({
              inviter_union_id: wx.getStorageSync('xy_session'),
              inviter_name: that.data.empInfo.name,
              invitee_union_id:that.data.inviterInfo.invitee_union_id,
              invitee_name:that.data.inviterInfo.invitee_name,
              company_id:that.data.companyInfo.company_id,
              assigned_role:4,
              invitation_type:0,
              title_name:that.data.inviterInfo.bossName
            })
          },
          success: res => {
            console.log(res.data);
            if (res.data.result.invitation_id) {
              that.setData({
                invitation_id: res.data.result.invitation_id,
                shareBtn: false
              })
            } else {
              wx.showToast({
                title: '邀请提交失败',
                icon: 'none'
              })
            }
          },
        })
      }
    })
  },
  backAction: function () {
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: that.data.companyInfo.company_short_name +'给您发送了一个邀请，期待您的到访！',
      path: '/pages/employee/senior-executive/receive/index?invitation_id='+that.data.invitation_id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
    
  }
})