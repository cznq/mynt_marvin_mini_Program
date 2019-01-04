// pages/employee/senior-executive/executiveHome/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    is_vip:true,//开通
    is_tryout:false//试用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_company_service_status',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          service_key: 'EMPLOYEE_BENIFIT'
        })
      },
      success: res => {
        console.log(res);
        if (res.data.result){
          if (res.data.result.service_status !== 0) {
            that.setData({
              is_vip: true
            })
            if (res.data.result.service_status == 2) {
              //试用
              that.setData({
                is_tryout: true
              })
            }
          } else {
            that.setData({
              is_vip: false
            })
          }
        }else{
          that.setData({
            is_vip: false
          })
        }
      }
    })
  },
  goExecutive:function () {
    wx.navigateTo({
      url: '/pages/employee/senior-executive/bossList/index',
    })
  },
})