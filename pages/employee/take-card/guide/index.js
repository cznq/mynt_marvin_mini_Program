var toast = require('../../../../templates/showToast/showToast');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_id: null,
    empInfo: null,
    opened: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      company_id: options.company_id
    })
  },

  /**
   * 获取员工信息
   */
  getEmployeeInfo: function () {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: unionId
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            empInfo: res.data.result
          })
          if (!app.Util.checkEmpty(that.data.empInfo.input_pic_url) && !app.Util.checkEmpty(that.data.empInfo.id_number)) {
            that.setData({
              opened: true
            })
          }
        }
      }
    })
  },

  /**
   * 开启快捷取卡
   */
  openFunction: function () {
    var self = this;
    toast.showToast(this, {
      toastStyle: 'toast6',
      title: '您还没有人脸信息，无法开启员工取卡，请前往录入。',
      mask: true,
      isSure: true,
      sureText: '前往录入',
      isClose: true,
      closeText: '取消'
    });
  },

  /**
   * 取消 开启快捷取卡
   */
  bindToastClose: function () {
    toast.hideToast();
  },

  /**
   * 确定 开启快捷取卡
   */
  bindToastSure: function () {
    var _this = this;
    toast.hideToast(_this, {
      cb: function () {
        if (app.Util.checkEmpty(_this.data.empInfo.id_number)) {
          wx.navigateTo({
            url: '/pages/collect-info/identity/index?company_id=' + _this.data.company_id
          })
        } else if (app.Util.checkEmpty(_this.data.empInfo.input_pic_url)) {
          wx.redirectTo({
            url: '/pages/collect-info/face/index?company_id=' + _this.data.company_id
          })
        } else {
          wx.redirectTo({
            url: '/pages/employee/take-card/success/index?company_id=' + _this.data.company_id
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getEmployeeInfo();
      })
    } else {
      that.getEmployeeInfo();
    }
  },


})