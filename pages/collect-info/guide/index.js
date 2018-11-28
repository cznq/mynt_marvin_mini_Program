const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    empInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getEmployeeInfo();
      })
    } else {
      that.getEmployeeInfo();
    }
  },

  /**
 * 获取员工信息
 */
  getEmployeeInfo: function () {
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
        if (res.data.result) {
          that.setData({
            empInfo: res.data.result
          })
          
        }
      }
    })
  },

  startRecodeInfo: function () {
    var that = this;
  
    if (app.Util.checkEmpty(that.data.empInfo.id_number)) {
      wx.navigateTo({
        url: '/pages/collect-info/identity/index',
      })
    }
    if (app.Util.checkEmpty(that.data.empInfo.input_pic_url) ) {
      wx.navigateTo({
        url: '/pages/collect-info/face/index',
      })
    }
    
  }



})