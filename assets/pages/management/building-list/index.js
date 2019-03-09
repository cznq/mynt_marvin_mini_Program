// assets/pages/management/building-list/index.js
var app = getApp();
import {
  CityList
} from '../../../../utils/pca.js'; //引入城市数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    clearSearchShow:false,
    searchFocus:false,
    searchBuildingList:'',
    codes: [], //城市ID
    city: '区域', //city名称
    citylist: CityList, //城市数据
    owner_id:'',
    employee_id:'',
    building_list:'',
    allBuilding:'',
    searchShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    //获取楼宇列表
    _this.getBuilding()
  },
  //获取楼宇列表
  getBuilding:function(province_id,city_id){
    var _this = this
    app.Util.networkUrl.postUrl({
      url: app.globalData.BASE_ASSET_URL+'/building/list/group',
      params: {
        data: JSON.stringify({
          province_id: province_id,
          city_id:city_id
        })
      },
      success: res => {
        if (res.data.result) {
          let arr = res.data.result.building_list;
          arr = arr.map(item => {
              let _stack = Object.keys(item);
              if (_stack.length === 0) { return; };
              let code = _stack.toString(), building = item[code];
              return { code, building};
          })
          //console.log(arr)
          //去掉第一个
          // let newArr =[]
          // for(var i=0;i<arr.length;i++){
          //   if(arr[i].code !=''){
          //     newArr.push(arr[i])
          //   }
          // }        
          _this.setData({
            building_list:arr,         
            allBuilding:arr[0].building
          })
          // console.log(_this.data.building_list)
          // console.log(_this.data.allBuilding)
        }
      }
    })
  },
  //搜索楼宇
  searchInput: function(e) {
    let _this = this
    let searchValue = e.detail.value;//用户实时输入值
    let arr = _this.data.allBuilding;
    var newList = []//匹配的结果
    if (searchValue) {
      _this.setData({
        clearSearchShow: true
      })
      arr.forEach(function (e) {
        if (e.building_name.indexOf(searchValue) != -1) {
          newList.push(e)
        }
      })
      _this.setData({
        searchBuildingList: newList,
        searchShow:true
      })
      console.log(_this.data.searchBuildingList)
    } else {
      this.setData({
        clearSearchShow: true
      })
    }

  },
  //清除搜索
  clearSearch: function() {
    this.setData({
      search: '',
      clearSearchShow: false,
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
  //选择市
  cityPicker(e) { 
    console.log(e)
    this.setData({
      codes: e.detail.code,
      city: e.detail.value[1]
    })
    this.getBuilding(this.data.codes[0],this.data.codes[1])
  },
  selectBuilding:function(e){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length-2];
    prevPage.setData({
      buildingInfo:e.currentTarget.dataset
    })
    wx.navigateBack({
      delta:1
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