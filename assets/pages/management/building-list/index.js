// assets/pages/management/building-list/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    clearSearchShow:false,
    searchFocus:false,
    searchBuildingList:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  searchInput: function(e) {
    let _this = this
    let _data = _this.data;
    let searchValue = e.detail.value;
    if (searchValue) {
      _this.setData({
        clearSearchShow: true
      })
     // _this.get_building_list(_this, _data.view_type, _data.time_range, 1, searchValue)
    } else {
      this.setData({
        clearSearchShow: true,
        searchBuildingList: []
      })
    }

  },
  //清除搜索
  clearSearch: function() {
    this.setData({
      search: '',
      clearSearchShow: false,
      searchBuildingList: [],
      ['searchNoneData.show']: false
    });
  },
  //获取焦点
  activeFocus: function(event) {
    this.setData({
      searchFocus: true
    });
  },
  //失去焦点
  loseFocus: function(event) {
    this.setData({
      searchFocus: false
    });
  },
  creatBuilding:function(){
    wx.navigateTo({
      url: '../creat-building/index',
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