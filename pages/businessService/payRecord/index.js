var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_size: 1,
    order_len: 0,
    noneData: {
      orderList: [],
      textInfo: '暂无交易记录',
      buttonText: '',
      emptyBtnFunc: '',
      show: false
    },
    forbid: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderRecord(this, 1, 10)
  },

  getOrderRecord: function(that, page, page_size) {

    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'pay',
        method: 'get_order_record',
        data: JSON.stringify({
          page: page,
          page_size: page_size
        }),
      },
      success: res => {
        console.log("获取订单记录:", res);
        if (res.data.return_code === "SUCCESS" && res.data.result) {
          let data = res.data.result
          let len = res.data.result.length
          if (data.length == that.data.order_len) {
            that.setData({
              forbid: true
            })
            wx.showToast({
              title: '加载完！',
              icon: 'none'
            })
            return false
          } else {
            that.setData({
              orderList: data,
              order_len: len
            }, () => {
              if (that.data.orderList.length === 0) {
                that.setData({
                  ['noneData.show']: true
                })
              } else {
                that.setData({
                  ['noneData.show']: false
                })
              }
            })
          }
        } else {
          if (res.data.return_code !== 0 && res.data.sub_msg) {
            wx.showToast({
              title: res.data.sub_msg,
              icon: 'none'
            })
          }
          that.setData({
            ['noneData.show']: true
          })
        }
      }
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

    let i = (this.data.page_size + 1) * 10;

    if (!this.data.forbid) {
      this.setData({
        page_size: i
      })
      this.getOrderRecord(this, 1, this.data.page_size)
    } else {
      wx.showToast({
        title: '加载完！',
        icon: 'none'
      })
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})