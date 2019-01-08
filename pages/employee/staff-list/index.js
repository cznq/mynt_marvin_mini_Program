var menu = require('../../../templates/showMenu/showMenu');
var toast = require('../../../templates/showToast/showToast');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: null,
    noneStaff: false,
    noneData: {
      buttonText: '邀请员工',
      textInfo: '还没有任何员工，赶紧邀请加入员工'
    },
    editData: {
      union_id: null,
      employee_name: null,
      role: null
    },
    role: '',
    searchStaffList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            role: res.data.result.role
          })
        }
      },
      fail: res => {}
    })

  },

  /**
   * 获取员工列表数据
   * first_name  员工列表的姓
   * last_name 员工列表的名字
   */
  getStaffList: function () {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_list',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            staffList: res.data.result
          })
        }
        
      }
    })
  },

  onShow: function () {
    this.getStaffList();
  },

  viewPerInfo(e) {
    var unionId = e.currentTarget.dataset.unionid;
    wx.navigateTo({
      url: '../staff-info/index?union_id=' + unionId,
    })
  },

  searchInput: function(e) {
    var searchValue = e.detail.value;
    var allList = this.data.staffList.admin.concat(this.data.staffList.employee);
    var searchResult = [];
    if (searchValue) {
      this.setData({
        clearSearchShow: true
      })
      for (let i = 0; i < allList.length; i++) {
        if (allList[i].employee_name.indexOf(searchValue) != -1) {
          searchResult.push(allList[i])
        }
      }
      console.log(searchResult);
      this.setData({ searchStaffList: searchResult })
    } else {
      this.setData({ searchStaffList: [] })
    }
    
  },

  clearSearch: function() {
    this.setData({ search: '', clearSearchShow: false });
  },

  inputFocus: function() {
    this.setData({ searchModal: true })
  },

  searchCancel: function() {
    this.setData({ searchModal: false })
  }

})