// pages/employee/senior-executive/fillName/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    employeeId:'',
    empInfo:'',
    bossName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      employeeId:options.unionId
    })
    console.log(that.data.employeeId)
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          employee_union_id:that.data.employeeId
        })
      },
      success: res => {;
        console.log(res.data.result)
        if (res.data.result) {
          that.setData({
            empInfo:res.data.result
          })
        }
      }
    })
  },
  giveTitle:function(e){
    var that = this
    that.setData({
      bossName: e.detail.value
    });
  },
  goShare:function () {
    if (this.data.bossName == "") {
      wx.showToast({
        title: '请输入高管的尊称',
        icon: 'none'
      })
      return false;
    } 
    var params = JSON.stringify({
      invitee_union_id: this.data.employeeId,
      invitee_name: this.data.empInfo.name,
      bossName: this.data.bossName
    })
    wx.navigateTo({
      url: '/pages/employee/senior-executive/bossShare/index?params='+ params,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})