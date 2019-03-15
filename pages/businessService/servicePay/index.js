// pages/businessService/servicePay/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    pck: [{
      price: [7, 8, 4, '.', 5],
      timeLength: 12,
      discount: 7,
      savedValue: 490,
      pckInfo: '原价￥954，限时折扣'
    },{
      price: [2, 7, 3],
      timeLength: 6,
      discount: 7,
      savedValue: 250,
        pckInfo: '原价￥784，限时折扣'
      },{
        price: [6, 1, 9],
        timeLength: 3,
        discount: 4,
        savedValue: 120,
        pckInfo: '原价￥365，限时折扣'
      },{
        price: [8, 4, 9],
        timeLength: 1,
        discount: null,
        savedValue: null,
        pckInfo: '原价￥12，限时折扣'
      }],
    chooseId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCompany(this);
  },

  choosePck: function(e) {
    console.log(e);
    let chid = e.currentTarget.dataset.pckid;
    this.setData({
      chooseId: chid
    })
  },

  packagePay() {
    
    wx.showToast({
      title: '你选择的套餐是' + this.data.pck[this.data.chooseId].timeLength + '个月',
      icon: 'none'
    })
  },

  /**
   * 获取公司信息
   */
  getCompany: function (_this) {
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
          _this.setData({
            cmpInfo: res.data.result
          })
          
        }
        
      }
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