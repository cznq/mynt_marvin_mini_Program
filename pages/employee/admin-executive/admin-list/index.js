
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: null,  
    role: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

  },

  /**
   * 获取员工列表数据
   * first_name  员工列表的姓
   * last_name 员工列表的名字
   */
  getStaffList: function () {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_list',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
  
        if (res.data.result) {
          that.setData({
            staffList: res.data.result
          })
        }

      }
    })
  },


  onShow: function () {
    this.getStaffList();
  }


})