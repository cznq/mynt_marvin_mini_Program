const app = getApp();
const util = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    bookId: 0,
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    const bookId = options.bookid
    // 设置titleStyle
    wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#FF6923'
      }),
      wx.setNavigationBarTitle({
        title: '当前页面'
      })
    _this.setData({
      bookId: bookId
    }) //获取预定ID
    _this.getOrder_detail(_this)
  },
  getOrder_detail: (_this) => {
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/get_order_detail",
      params: {
        data: JSON.stringify({
          book_id: 25
        })
      },
      success: res => {
        console.log('res:', res);
        if (res.data.sub_code === 'SUCCESS' && res.data.sub_code) {
          const result = res.data.result
          if (result.book_type === 2) {
            let appointment_time = util.formatTime(result.appointment_time, 3)
            result.appointment_time = appointment_time
          } else {

          }
          _this.setData({
            detail: result
          })

        }

      },
      fail: res => {
        console.log('res:fail', res);
      }
    })
  },
  jumpDetail() {
    wx.navigateTo({
      url: ''
    })
  },
  invoiceBtn() {
    wx.chooseInvoiceTitle({
      success(res) {

      }
    })
  },
  previewImage() {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [] // 需要预览的图片http链接列表
    })
  },
  callUp() {
    wx.makePhoneCall({
      phoneNumber: '0571-82613693' // 仅为示例，并非真实的电话号码
    })
  },
  canlceBtn() {
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/cancel_order",
      params: {
        data: JSON.stringify({
          book_id: 25
        })
      },
      success: res => {
        console.log('res:', res);
        if (res.data.sub_code === 'SUCCESS' && res.data.sub_code) {

        }

      },
      fail: res => {
        console.log('res:fail', res);
      }
    })
  },
  viewRecord(e) {
    console.log('e:', e);
    const bill_image_url = e.currentTarget.data.bill_image_url
    wx.previewImage({
      urls: [bill_image_url] // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})