var toast = require('../../../../templates/showToast/showToast');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   * cardType   card门卡, e-card电子门卡
   * serviceStatus  tried 试用；closed 关闭；opened 开通；
   */
  data: {
    company_id: null,
    empInfo: null,
    serviceStatus: 'closed',
    cardType: 'e-card'
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
          if (that.data.serviceStatus !== 'closed' && !app.Util.checkEmpty(that.data.empInfo.input_pic_url) && !app.Util.checkEmpty(that.data.empInfo.id_number)) {
            wx.navigateTo({
              url: '../success/index',
            })
          }
        } else {
          
        }
      }
    })
  },

  /**
   * 开启快捷取卡
   */
  openTakeCard: function () {
    wx.navigateTo({
      url: '/pages/collect-info/guide/index?company_id=' + this.data.company_id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        app.getServiceStatus(that, 'EMPLOYEE_TAKE_CARD', that.getEmployeeInfo());
  
      })
    } else {
      app.getServiceStatus(that, 'EMPLOYEE_TAKE_CARD', that.getEmployeeInfo());
    }
  },

  /**
  * 了解小觅商业服务套件
  */
  viewBusinessService() {
    app.viewBusinessService();
  }


})