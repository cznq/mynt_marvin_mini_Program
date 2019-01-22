var toast = require('../../../../templates/showToast/showToast');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   * cardType   0实体门卡, 1电子门卡
   * serviceStatus  tried 试用；closed 关闭；opened 开通；
   */
  data: {
    cmpInfo: null,
    serviceStatus: 'closed',
    hasFace: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getServiceStatus(that, 'EMPLOYEE_TAKE_CARD', function(){that.getCompany()});
    
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
      showLoading: false,
      success: res => {
        if (res.data.result) {
          that.setData({
            cmpInfo: res.data.result
          })
          that.getEmployeeInfo(res.data.result.take_card_ways);
        } else {
          wx.redirectTo({
            url: '/pages/manage/manage',
          })
        }
        
      }
    })
  },
  /**
   * 获取员工信息
   */
  getEmployeeInfo(take_card_way) {
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
      showLoading: false,
      success: res => {
        if (res.data.result) {
          if (that.data.serviceStatus !== 'closed' && !app.Util.checkEmpty(res.data.result.input_pic_url)) {
            if (take_card_way==0){
              that.setData({ hasFace: true })
              that.setData({
                empInfo: res.data.result
              })
              wx.setNavigationBarTitle({
                title: '开通员工取卡'
              })
            } else {
              wx.redirectTo({
                url: '/pages/e-card/detail/index',
              })
            }
          } else {
            that.setData({
              empInfo: res.data.result
            })
            wx.setNavigationBarTitle({
              title: '开通员工取卡'
            })
          }
          
        } 
      }
    })
  },

  /**
   * 开启快捷取卡
   */
  openTakeCard: function () {
    var parmas = JSON.stringify({
      company_id: this.data.cmpInfo.company_id,
      card_type: this.data.cmpInfo.take_card_ways
    })
    wx.navigateTo({
      url: '/pages/collect-info/guide/index?source=takeCard&params=' + parmas
    })    
  },

  /**
  * 了解小觅商业服务套件
  */
  viewBusinessService() {
    app.viewBusinessService();
  },

  /**
   * 返回快捷取卡指南页
   */
  backGuide: function () {
    wx.navigateTo({
      url: '/pages/employee/take-card/guide/index'
    })
  }


})