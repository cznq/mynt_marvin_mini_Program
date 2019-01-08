// pages/employee/perInfo/index.js
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
    console.log(options.union_id)
    /** 获取员工信息 **/
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          employee_union_id: options.union_id
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            empInfo: res.data.result
          });
        }
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'company',
            method: 'get_info',
            data: JSON.stringify({
              union_id: wx.getStorageSync('xy_session'),
            })
          },
          success: res => {
            if (res.data.result) {
              that.setData({
                compInfo: res.data.result
              });
            }

          }
        })

      }
    })
    
  }



})