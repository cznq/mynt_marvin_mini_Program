// pages/employee/admin-executive/adminShare/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textInfo: '很高兴邀请您成为本公司新的管理员，您将拥有我们的以下管理权力，烦请点击下方按钮接受邀请并开始使用管理权力。'
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

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var title = that.data.empInfo.name
    return {
      title: that.data.companyInfo.company_short_name + '给您发送了一个邀请，期待您的到访！',
      path: '/pages/invite-visitor/receive/index?invitation_id=' + that.data.invitation_id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})