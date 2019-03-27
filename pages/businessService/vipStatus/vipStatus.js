// businessService/vipStatus/vipStatus.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    company_name: '',
    company_short_name: '',
    logo: "",
    service_status: 0, //（0：未开通，1：已开通，2：已过期）
    end_sign: '',
    end_time: '',
    vipStatus: 'opening',
    submit: '续费享折扣'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCompany(this);
    this.getServiceStatus(this);
  },
  /**
   * 获取公司
   */
  getCompany: function(that) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({}),
      },
      success: res => {
        // console.log("公司信息:", res);
        if (res.data.return_code === "SUCCESS" && res.data.result) {
          let data = res.data.result
          that.setData({
            company_name: data.company_name,
            company_short_name: data.company_short_name,
            logo: data.logo
          })
        } else if (res.data.sub_code !== 0) {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none'
          })

        }
      }
    })
  },
  /**
   * 获取当前状态
   */
  getServiceStatus: function(that) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_business_service_suite_status',
        data: JSON.stringify({}),
      },
      success: res => {
        // console.log("res:", res);
        if (res.data.return_code === "SUCCESS" && res.data.result) {
          let data = res.data
          that.setData({
            service_status: data.result.business_service_suite_status,
            end_time: data.result.end_time
          }, () => {
            if (that.data.service_status == "1") {
              that.setData({
                end_sign: "有效期",
                submit: "续费享折扣"
              })
            } else {
              that.setData({
                end_sign: "过期",
                submit: "立即开通"
              })
            }

          })

        } else if (res.data.sub_code !== 0) {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none'
          })

        }

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