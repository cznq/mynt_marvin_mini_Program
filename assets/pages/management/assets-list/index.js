// assets/pages/management/assets-list/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    owner_id: '', //房东id
    employee_id: '',
    assetName: '',
    hasAssets: true,
    asset_list: '',
    noneAssets: {
      pointer: true,
      title: '暂无资产',
      textInfo: '创建资产，开启智能收费核销',
      pic: app.globalData.BASE_IMG_URl + 'assets/empty_no_asset%402x.png',
      picSize: {
        width: 180 + 'rpx',
        height: 144 + 'rpx',
        marginTop: 306 + 'rpx'
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    var that = this;
    that.setData({
      owner_id: JSON.parse(options.params).owner_id,
      employee_id: JSON.parse(options.params).employee_id,
      assetName: JSON.parse(options.params).assetName
    })
    app.Util.networkUrl.postUrl({
      url: app.globalData.BASE_ASSET_URL + '/asset/building_list',
      params: {
        data: JSON.stringify({
          owner_id: this.data.owner_id,
          employee_id: this.data.employee_id //员工身份请求时，传此值
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            asset_list: res.data.result.asset_count_list,
            hasAssets: true
          })
        } else {
          that.setData({
            hasAssets: false
          })
        }
      }
    })
  },
  addAsset: function(e) {
    var params = JSON.stringify({
      owner_id: this.data.owner_id,
      employee_id: this.data.employee_id
    })
    wx.navigateTo({
      url: '../add-asset/index?params=' + params + '&from=' + e.currentTarget.dataset.from,
    })
  },
  //获取楼宇下资产列表信息
  getBuildingAsset: function(e) {
    var buildingInfo = JSON.stringify({
      building_id: e.currentTarget.dataset.id,
      building_name: e.currentTarget.dataset.building_name,
      building_address: e.currentTarget.dataset.building_address,
      owner_id: this.data.owner_id,
      employee_id: this.data.employee_id
    })
    wx.navigateTo({
      url: '../building_room/index?buildingInfo=' + buildingInfo,
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