const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empInfo: null,
    cmpInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEmployeeInfo();
    this.getCompany();
  },

  /**
   * 获取员工信息
   */
  getEmployeeInfo: function () {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: unionId,
        })
      },
      success: res => {
        if (res.data.sub_msg == '没找到对应的职员') {
          wx.redirectTo({
            url: '/pages/manage/manage',
          })
        }
        if (res.data.result) {
          if (res.data.result.avatar == "") {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1]
            var url = currentPage.route;
            var opt = JSON.stringify(currentPage.options)
            wx.redirectTo({
              url: '/pages/login/index?route=' + url + '&opt=' + opt,
            })
          }
          wx.setNavigationBarTitle({
            title: '个人中心'
          })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#009CFF'
          })
          res.data.result.fuzz_id_number = that.fuzzIdNumber(res.data.result.id_number);
          that.setData({
            empInfo: res.data.result
          });
        }
      }
    })
  },

  /**
   * 获取公司信息
   */
  getCompany: function () {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            cmpInfo: res.data.result
          })
        }
      }
    })
  },

  /**
   * 模糊身份证信息
   */
  fuzzIdNumber(id_number) {
    if(id_number=='') {
      return '';
    } else {
      var newid = id_number.substr(0, 2) + '*'.repeat(id_number.length-4) + id_number.substr(id_number.length-2, 2);
      return newid;
    }
  },

  /**
   * 重置人脸信息
   */
  resetFace: function () {
    var source = 'reRecodeFace';
    var params = JSON.stringify({
      company_id: this.data.cmpInfo.company_id
    })
    wx.navigateTo({
      url: '/pages/collect-info/confirmIdentity/index?source=' + source + '&params=' + params,
    })
  },

  recodeFace: function () {
    var source = 'editInfo',
    params = JSON.stringify({
      company_id: this.data.cmpInfo.company_id
    })
    wx.navigateTo({
      url: '/pages/collect-info/identity/index?source=' + source + '&params=' + params
    })
  },

  /**
   * 查看公司信息
   */
  reviewCompany: function () {
    wx.navigateTo({
      url: '/pages/company/introduction/index',
    })
  },

  /**
   * 修改名字
   */
  editName: function () {
    wx.navigateTo({
      url: '/pages/employee/edit-name/index',
    })
  },

  editPhone: function () {
    wx.navigateTo({
      url: '/pages/employee/edit-phone/index',
    })
  }

})