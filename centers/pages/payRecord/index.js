var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curr_page: 1,
    noneData: {
      textInfo: '暂无交易记录',
      buttonText: '',
      emptyBtnFunc: '',
      show: false
    },
    orderList: [],
    forbid: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderRecord(this, 1, 5)
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
        // console.log("获取订单记录:", res);
        if (res.data.return_code === "SUCCESS" && res.data.result) {
          let data = res.data.result.record_list
          const newOrderList = that.data.orderList.concat(data)
          that.setData({
            orderList: newOrderList,
            total_page: res.data.result.total_page
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
    if (this.data.curr_page != this.data.total_page) {
      let page = this.data.curr_page + 1
      this.setData({
        curr_page: page
      })
      this.getOrderRecord(this, this.data.curr_page, 5)
    } else {
      wx.showToast({
        title: '我们是有底线的哦！',
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