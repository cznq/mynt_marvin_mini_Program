var toast = require('../../../../templates/showToast/showToast');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   * cardType   card门卡, e-card电子门卡
   * serviceStatus  tried 试用；closed 关闭；opened 开通；
   */
  data: {
    cmpInfo: null,
    serviceStatus: 'closed',
    cardType: 'e-card'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        app.getServiceStatus(that, 'EMPLOYEE_TAKE_CARD', that.getCompany());

      })
    } else {
      app.getServiceStatus(that, 'EMPLOYEE_TAKE_CARD', that.getCompany());
    }
  },

  getCompany: function () {
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
        if (res.data.result) {
          that.setData({
            cmpInfo: res.data.result
          })
          if (res.data.result.take_card_ways == 0) {
            that.setData({
              cardType: 'card'
            })
          } else if (res.data.result.take_card_ways == 1) {
            that.setData({
              cardType: 'e-card'
            })
          } 
        }

      }
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
      url: '/pages/collect-info/guide/index?company_id=' + this.data.cmpInfo.company_id
    })
  },

  /**
  * 了解小觅商业服务套件
  */
  viewBusinessService() {
    app.viewBusinessService();
  }


})