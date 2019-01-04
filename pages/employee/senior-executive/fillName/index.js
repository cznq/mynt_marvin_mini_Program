// pages/employee/senior-executive/fillName/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    employeeId:'',
    empInfo:'',
    bossName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      employeeId:options.id
    })
    //console.log(that.data.employeeId)
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: that.data.employeeId,
        })
      },
      success: res => {;
        //console.log(res.data.result)
        if (res.data.result) {
          res.data.result.first_name = res.data.result.name.substring(0,1);
          that.setData({
            empInfo:res.data.result
          })
        }
      }
    })
  },
  getTitle:function(e){
    var that = this
    that.setData({
      bossName: e.detail.value
    });
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'give_title',
        data: JSON.stringify({
          union_id: that.data.employeeId,
          title_name:that.data.bossName,
        })
      },
      success: res => {
        console.log(res.data.result)
        if (res.data.result) {
          
        }
      }
    })
  },
  goShare:function () {
    wx.navigateTo({
      url: '/pages/employee/senior-executive/bossShare/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})