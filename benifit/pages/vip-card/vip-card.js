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
  onLoad: function(options) {
    //wx.removeStorageSync('xy_session');
    var that = this;
    var commerceData = that.data.commerceData;
    that.getEmployeeInfo();
    for (let index in commerceData) {
      that.getHotCommerce(index);
    };
  },
  /**
   * 获取员工信息
   */
  getEmployeeInfo() {
    var that = this;
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/company/get_company_service_status",
      params: {
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          service_key: 'EMPLOYEE_BENIFIT'
        })
      },
      success: res => {
        console.log("get_company_service_status:", res);
        //res.data.result.service_status=0;
        if (res.data.result) {
          if (res.data.result.service_status !== 0) {
            console.log('kaitong');
            app.request.requestApi.post({
              url: app.globalData.BANQUET_API_URL + "/company/get_employee_info",
              params: {
                data: JSON.stringify({})
              },
              success: res => {
                console.log("get_employee_info:", res);
                if (res.data.result) {
                  that.setData({
                    is_vip: true
                  })
                  if (wx.setBackgroundColor) {
                    wx.setBackgroundColor({
                      backgroundColor: '#404452', // 窗口的背景色为白色
                    })
                  }
                  if (wx.setNavigationBarColor) {
                    wx.setNavigationBarColor({
                      frontColor: '#ffffff',
                      backgroundColor: '#404452'
                    })
                  }
                  that.setData({
                    employeeInfo: res.data.result
                  })
                } else {
                  that.setData({
                    is_vip: false
                  })
                }
              }
            })
          } else {
            that.setData({
              is_vip: false
            })
          }
        } else {
          that.setData({
            is_vip: false
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
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/get_hot_commerce",
      params: {
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          type: typeId
        })
      },
      success: res => {
        console.log('get_hot_commerce:', res);
        if (res.data.result.commerces) {
          if (typeId == 0) {
            that.setData({
              hotDinnerCommerce: res.data.result.commerces
            })
          } else if (typeId == 1) {
            that.setData({
              hotEnterCommerce: res.data.result.commerces
            })
          } else {
            that.setData({
              hotHotelCommerce: that.transData(res.data.result.commerces)
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
  redirectCommerce: function(e) {
    var commerce_id = e.currentTarget.dataset.commerceid;
    var commerce_type = e.currentTarget.dataset.commercetype;
    wx.navigateTo({
      url: '/benifit/pages/mall-detail/mall-detail?commerce_id=' + commerce_id + '&commerce_type=' + commerce_type,
    })
  },
  /**
   * 跳转到商城首页
   */
  redirectMall: function(e) {
    console.log(e);
    var tabSelected = e.currentTarget.dataset.tabselected;
    var selectedType = e.currentTarget.dataset.selectedtype;
    console.log(tabSelected + '--' + selectedType);
    wx.navigateTo({
      url: '/benifit/pages/mall-home/mall-home?tabSelected=' + tabSelected + '&selectedType=' + selectedType,
    })
  }
})