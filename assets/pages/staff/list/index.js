const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 6,
    pageNum: 1,
    isLastPage: false,
    staffCount: 0,
    staffList: [],
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
    this.getStaffList(this, true)
  },

  getStaffList(_this, refresh) {
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
        
        if(refresh){
          _this.setData({
            pageNum: 1,
            staffList: []
          })
        }
        if (res.data.result.employee_list) {
          if (res.data.result.employee_list.length < _this.data.pageSize) {
            _this.setData({
              isLastPage: true
            });
          }
          if (res.data.result.employee_list.length > 0) {
            console.log(res.data.result.employee_list);
            _this.setData({
              staffList: _this.data.staffList.concat(res.data.result.employee_list),
              staffCount: res.data.result.total
            });
          }
          
        }
        
        
      }
    })
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
        pageNum: self.data.pageNum + 1
      });
      console.log('当前页' + self.data.page);
      self.getStaffList(self, false);
    }
    else {
      console.log('最后一页');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShow: function () {
    
    this.getStaffList(this, true)
  }
})