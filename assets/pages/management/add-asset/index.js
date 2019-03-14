// assets/pages/management/add-asset/index.js
var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildingInfo: '',
    floor_list: [],
    nextStep: true,
    room: '',
    roomArea: '',
    floor_index: '',
    from:'',
  },

  /**
   * 生命周期函数--监听页面加载
   * options.from   roomLIst 房间号列表; assetList 资产列表
   */
  onLoad: function(options) {
    //console.log(options)
    this.setData({ from: options.from })
    if(options.from =='assetList'){
      this.setData({
        owner_id: JSON.parse(options.params).owner_id,
        employee_id: JSON.parse(options.params).employee_id,
        nextStep: true,
      })
    }else if(options.from =='roomList'){
      this.setData({
        owner_id: JSON.parse(options.buildingAsset).owner_id,
        employee_id: JSON.parse(options.buildingAsset).employee_id,
        buildingInfo:JSON.parse(options.buildingAsset).buildingInfo,
        nextStep: true,
      })
      console.log(this.data.buildingInfo)
    }else if(options.from =='editAsset'){
      this.setData({
        owner_id: JSON.parse(options.buildingAsset).owner_id,
        employee_id: JSON.parse(options.buildingAsset).employee_id,
        buildingInfo:JSON.parse(options.buildingAsset).buildingInfo,
        floor_index: JSON.parse(options.buildingAsset).floor_index,
        floor:JSON.parse(options.buildingAsset).floor,
        room:JSON.parse(options.buildingAsset).room,
        roomArea:JSON.parse(options.buildingAsset).area,
        nextStep: false,
      })
    }
    
  },
  //选择所属楼宇
  selectBuilding: function() {
    var params = JSON.stringify({
      owner_id: this.data.owner_id,
      employee_id: this.data.employee_id
    })
    wx.navigateTo({
      url: '../building-list/index?params=' + params,
    })
  },
  getFloor: function() {
    var that = this;
    app.Util.networkUrl.postUrl({
      url: app.globalData.BASE_ASSET_URL + '/floor/index/list',
      params: {
        data: JSON.stringify({
          building_id: that.data.buildingInfo.id,
        })
      },
      success: res => {
        if (res.data.result) {
          // let arr = res.data.result.floor_index_list;
          // let floorName = [];
          // for (var i = 0; i < arr.length;i++){
          //   floorName.push(arr[i].floor_name,)
          // }
          that.setData({
            floor_list: res.data.result.floor_index_list
          })
        }
      }
    })
  },
  //选择楼层
  selectFloor: function(e) {
    let n = e.detail.value
    this.setData({
      index: n,
      floor_index: this.data.floor_list[n].floor_index
    })
    if (this.data.buildingInfo != '' && this.data.room != '' && this.data.roomArea != '' && this.data.floor_index != '') {
      this.setData({
        nextStep: false
      })
    } else {
      this.setData({
        nextStep: true
      })
    }
  },
  //没有楼层选择
  selectNo: function() {
    toast.showToast(this, {
      toastStyle: 'toast',
      title: '请先选择资产所在楼宇',
      duration: 1500,
      mask: false
    });
  },
  // 检测是否可以进入下一步
  getRoom: function(e) {
    this.setData({
      room: e.detail.value
    })
    if (this.data.buildingInfo != '' && this.data.room != '' && this.data.roomArea != '' && this.data.floor_index != '') {
      this.setData({
        nextStep: false
      })
    } else {
      this.setData({
        nextStep: true
      })
    }
  },
  checkNext: function(e) {
    this.setData({
      roomArea: e.detail.value
    })
    if (this.data.buildingInfo != '' && this.data.room != '' && this.data.roomArea != '' && this.data.floor_index != '') {
      this.setData({
        nextStep: false
      })
    } else {
      this.setData({
        nextStep: true
      })
    }
  },
  goNext: function() {
    var assetInfo = JSON.stringify({
      buildingInfo: this.data.buildingInfo,
      floor_index: this.data.floor_index,
      room: this.data.room,
      roomArea: this.data.roomArea,
      owner_id: this.data.owner_id,
      employee_id: this.data.employee_id
    })
    wx.navigateTo({
      url: '../add-assetProve/add-assetProve?assetInfo=' + assetInfo,
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
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.buildingInfo) {
      that.setData({
        buildingInfo: currPage.data.buildingInfo
      })
    }
    console.log(that.data.buildingInfo)
    if (that.data.buildingInfo) {
      that.getFloor();
    }
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