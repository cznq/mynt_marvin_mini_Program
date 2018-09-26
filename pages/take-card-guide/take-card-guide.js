// pages/take-card-guide/take-card-guide.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xy_session: null,
    company_id: null,
    empInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      company_id: options.company_id
    })
  },

  goEditInfo: function() {
    if (this.data.empInfo.id_number == "" || this.data.empInfo.id_number == null) {
      wx.navigateTo({
        url: '/pages/edit-info/edit-info?company_id=' + this.data.company_id
      })
    } else if (this.data.empInfo.input_pic_url == "" || this.data.empInfo.input_pic_url == null) {
      wx.redirectTo({
        url: '/pages/invite-accept/invite-accept?company_id=' + this.data.company_id
      })
    } else {
      wx.redirectTo({
        url: '/pages/take-card-success/take-card-success?company_id=' + this.data.company_id
      })
    }
  },

  getEmployeeinfo: function () {
    var that = this;
    var unionId = that.data.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        union_id: unionId,
        data: JSON.stringify({
          
        })
      },
      success: res => {
        console.log(res);
        that.setData({
          empInfo: res.data.result
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.setData({
          xy_session: wx.getStorageSync('xy_session')
        })
        that.getEmployeeinfo();
      })
    } else {
      that.setData({
        xy_session: wx.getStorageSync('xy_session')
      })
      that.getEmployeeinfo();
    }
  },

 
})