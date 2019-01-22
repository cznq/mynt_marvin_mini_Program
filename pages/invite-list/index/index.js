var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity:1,//0:非员工,1:普通职员,2:前台,3:公司管理员
    initeType:'all',
    allTime:false,
    seleTime:'全部时间',
    noneData:{
      buttonText:'邀请访客',
      emptyBtnFunc:'',
      textInfo:'暂无邀请',
      show:false
    },
    searchNoneData:{
      textInfo:'找不到匹配的内容',
      show:false
    },
    searchModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.get_employee_status(_this);
  },
  //获取用户状态
  get_employee_status: function(_this) {
      app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
              service: 'company',
              method: 'get_employee_info',
              data: JSON.stringify({})
          },
          success: res => {
            console.log('响应:',res);
            let data = res.data;
            if (data.sub_code === 0) {
              switch (data.result.role) {//0:角色待定,1:普通职员,2:前台,3:公司管理员
                case 0:
                  wx.redirectTo({
                      url: '/pages/manage/manage'
                    })
                  break;
                case 1:
                  _this.setData({
                    identity:1
                  })
                  break;
                case 2:
                  _this.setData({
                    identity:2
                  })
                  break;
                case 3:
                  _this.setData({
                    identity:3
                  })
                  break;
                default:
                  break;
              }
            }else{
                wx.redirectTo({
                    url: '/pages/manage/manage'
                  })
            }



          },
          fail: res => {
              console.log('fail');
          }
      })
  },
  headTab:function(e){
    console.log(e.target.dataset.name);
    let name = e.target.dataset.name;
    this.setData({
      initeType:name
    })
  },
  allTimeState:function() {
    let allTime = this.data.allTime;
    if (allTime) {
      this.setData({
        allTime:false
      })
    }else {
      this.setData({
        allTime:true
      })
    }
  },
  seleTime:function(e) {
    let seleTime = e.target.dataset.name;
    this.setData({
      seleTime:seleTime
    })
  },
  maskMove:function(){
    return false
  },
  currentEmployee:function () {
    wx.navigateTo({
      url:'../invite-detail/invite-detail'
    })
  },

  searchInput: function(e) {
    var searchValue = e.detail.value;
    // let { admin, front_desk, employee } = this.data.staffList;
    // var allList = [...admin, ...front_desk, ...employee];
    // for (var index in allList) {
    //   if (allList[index].invite_status == 0) {
    //     allList.splice(index, 1)
    //   }
    // }

    var searchResult = [];
    if (searchValue) {
      this.setData({
        clearSearchShow: true
      })
      // for (let i = 0; i < allList.length; i++) {
      //   if (allList[i].employee_name.indexOf(searchValue) != -1) {
      //     searchResult.push(allList[i])
      //   }
      // }
      this.setData({ searchStaffList: searchResult })
    } else {
      this.setData({ clearSearchShow: true, searchStaffList: [] })
    }

  },

  clearSearch: function() {
    this.setData({ search: '', clearSearchShow: false });
  },

  startSearchInput: function() {
    this.setData({ searchModal: true })
  },

  searchCancel: function() {
    this.setData({ searchModal: false })
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
