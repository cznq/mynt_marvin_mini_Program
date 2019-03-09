// assets/pages/management/add-asset/index.js
var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildingInfo:'',
    floor_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      owner_id:JSON.parse(options.params).owner_id,
      employee_id:JSON.parse(options.params).employee_id
    })
  },
  //选择所属楼宇
  selectBuilding:function(){  
    var params = JSON.stringify({
      owner_id: this.data.owner_id,
      employee_id:this.data.employee_id
    })
    wx.navigateTo({
      url: '../building-list/index?params='+ params,
    })
  },
  getFloor:function(){
    var that =this;
    app.Util.networkUrl.postUrl({
      url: app.globalData.BASE_ASSET_URL+'/floor/index/list',
      params: {
        data: JSON.stringify({
          building_id: that.data.buildingInfo.id,
        })
      },
      success: res => {
        if (res.data.result) {
          let arr = res.data.result.floor_index_list;
          let floorName = [];
          for (var i = 0; i < arr.length;i++){
            floorName.push(arr[i].floor_name,) 
          }
          that.setData({
            floor_list:floorName
          })
         //console.log(that.data.floor_list)
        }
      }
    })
  },
  //选择楼层
  selectFloor: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  //没有楼层选择
  selectNo:function(){
    toast.showToast(this, {
      toastStyle: 'toast',
      title: '请先选择资产所在楼宇',
      duration: 1500,
      mask:false
    });
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
    var that=this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length-1];
    if(currPage.data.buildingInfo){
      that.setData({
        buildingInfo:currPage.data.buildingInfo
      })
    }
    if(that.data.buildingInfo){
      that.getFloor();
    }
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