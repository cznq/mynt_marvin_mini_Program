// pages/benifit-card/benifit-card.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_vip: null,
    employeeInfo: null,
    commerceData: [0, 1, 2],
    hotDinnerCommerce: null,
    hotHotelCommerce: null,
    hotEnterCommerce: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.removeStorageSync('xy_session');
    var that = this;
    var commerceData = that.data.commerceData;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getEmployeeInfo();
        for (let index in commerceData) {
          that.getHotCommerce(index);
        };
      })
    } else {
      that.getEmployeeInfo();
      for (let index in commerceData) {
        that.getHotCommerce(index);
      };  
    }
  },

  /**
   * 获取员工信息
   */
  getEmployeeInfo() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({})
      },
      success: res => {
        if (res.data.result) {
          if (res.data.result.has_employee_benefit == 1) {
            that.setData({ is_vip: true })
          } else {
            that.setData({ is_vip: false })
          }
          that.setData({
            employeeInfo: res.data.result
          })
        }
      }
    })
  },

  /**
   * 获取热门商家列表
   */
  getHotCommerce(typeId) {
    var that = this; 
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'commerce',
        method: 'get_hot_commerce',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          type: typeId
        })
      },
      success: res => {
        if (res.data.result) {
          if (typeId == 0) {
            that.setData({
              hotDinnerCommerce: res.data.result
            })
          } else if (typeId == 1) {
            that.setData({
              hotEnterCommerce: res.data.result
            })
          } else {
            that.setData({
              hotHotelCommerce: that.transData(res.data.result)
            })
          }
        }
      }
    })
  },

  transData(preData) {
    for (var i = 0; i < preData.length; i++) {
      preData[i].agreement_price = String(preData[i].agreement_price).split('');
    }
    return preData;
  },

  /**
   * 跳转到商家详情
   */
  redirectCommerce: function (e) {
    var commerce_id = e.currentTarget.dataset.commerceid;
    var commerce_type = e.currentTarget.dataset.commercetype;
    wx.navigateTo({
      url: '/page/benifit/pages/mall-detail/mall-detail?commerce_id=' + commerce_id + '&commerce_type=' + commerce_type,
    })
  },

  /**
   * 跳转到商城首页
   */
  redirectMall: function (e) {
    console.log(e);
    var tabSelected = e.currentTarget.dataset.tabselected;
    var selectedType = e.currentTarget.dataset.selectedtype;
    console.log(tabSelected + '--' + selectedType);
    wx.navigateTo({
      url: '/page/benifit/pages/mall-home/mall-home?tabSelected=' + tabSelected + '&selectedType=' + selectedType,
    })
  }

})