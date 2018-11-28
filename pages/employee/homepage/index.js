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
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getEmployeeInfo();
        that.getCompany();
      })
    } else {
      that.getEmployeeInfo();
      that.getCompany();
    }
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
        console.log(res);
        if (res.data.result) {
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
        console.log(res);
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
      console.log(newid);
      return newid;
    }
  },

  /**
   * 重置人脸信息
   */
  resetFace: function () {
    wx.navigateTo({
      url: '/pages/collect-info/confirm/index',
    })
  },

  recodeFace: function () {
    wx.navigateTo({
      url: '/pages/collect-info/identity/index?company_id=' + this.data.cmpInfo.company_id,
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
  }

})