const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffCount: 0,
    staffList: [{
        "employee_id": 1,
        "union_id": "o3iamjh_tpecJOwgrAhWHM7CQb2k",
        "name": "李四",
        "phone": "130xxxxxxxx",
        "role": 0,
        "owner_id": 1,
        "manage_asset_count": 0,
        "manage_asset_total_amount": 0
      }
    ],
    noneData: {
      pointer: true,
      title: '暂无资产',
      textInfo: '添加人员，帮助您添加资产、核销缴费',
      picSize: {
        width: '180rpx',
        height: '156rpx',
        marginTop: '178rpx'
      },
      pic: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/no-staff%402x.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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