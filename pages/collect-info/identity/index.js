
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    const query = wx.createSelectorQuery()
    query.select('#id_num').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      
      _this.setData({
        errorData: {
          top: res[0].top+80,
          text: 'hello world',
          bgcolor: '#fcd7d7',
          txtcolor: 'rgba(245, 113, 113, 1)'

        }
      })
    })
    
  },

  

  showError: function () {
    this.setData({
      errorData: {
        top: 300,
        text: 'hello world',
        bgcolor: 'rgba(252, 252, 252, 1)',
        txtcolor: 'rgba(136, 145, 169, 1)'

      }
    })
  },

  showInfo: function () {
    this.setData({
      errorData: {
        top: 300,
        text: 'hello world',
        bgcolor: 'rgba(252, 252, 252, 1)',
        txtcolor: 'rgba(136, 145, 169, 1)'

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