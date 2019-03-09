const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    pageNum: 1,
    isLastPage: false,
    staffCount: 0,
    staffList: [{
        "employee_id": 1,
        "union_id": "",
        "name": "李四",
        "phone": "130xxxxxxxx",
        "role": 0,
        "owner_id": 1,
        "manage_asset_count": 0,
        "manage_asset_total_amount": 0
      },
      {
        "employee_id": 1,
        "union_id": "dsf88sd8f8se777afdkfdknuuuu",
        "name": "王五",
        "phone": "130xxxxxxxx",
        "role": 0,
        "owner_id": 1,
        "manage_asset_count": 0,
        "manage_asset_total_amount": 0
      }
    ],
    noneData: {
      pointer: true,
      title: '暂无资产',
      textInfo: '添加人员，帮助您添加资产、核销缴费',
      picSize: {
        width: '180rpx',
        height: '156rpx',
        marginTop: '178rpx'
      },
      pic: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/no-staff%402x.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    _this.getStaffList(_this)
  },

  getStaffList(_this) {
    app.Util.networkUrl.postUrl({
      url: app.globalData.BASE_ASSET_URL + '/employee/list',
      params: {
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          page_size: _this.data.pageSize,
          page: _this.data.pageNum
        })
      },
      success: res => {
        if(res.data.reslut) {
          if (res.data.result.employee_list.length < _this.data.pageSize) {
            _this.setData({
              isLastPage: true,
              staffList: _this.data.staffList.concat(res.data.result.employee_list)
            });
          }
        }
        
        
      }
    })
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    var self = this;
    if (!self.data.isLastPage) {
      self.setData({
        page: self.data.pageNum + 1
      });
      console.log('当前页' + self.data.page);
      this.fetchPostsData(self.data);
    }
    else {
      console.log('最后一页');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})