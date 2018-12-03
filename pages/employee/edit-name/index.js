
const app = getApp();
Page({

  data: {
    isIphoneX: app.globalData.isIphoneX,
    formData: {
      name: null
    },
    inputError: {
      name: false
    },
    errorData: null,
    empInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getEmployeeInfo();
      })
    } else {
      that.getEmployeeInfo();
    }
  },

  editSubmit: function (e) {
    var name = e.detail.value.name;
   
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'update_employee',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          name: name,
          avatar: wx.getStorageSync('avatar')
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {
          wx.redirectTo({
            url: '/pages/employee/homepage/index',
          })
        } else {
          wx.showModal({
            content: res.data.error_msg,
            showCancel: false
          })
        }
      }
    })
    

  },

  /**
   * 检测表单可提交状态
   */
  checkForm: function (e) {
    this.setData({
      errorData: null,
      'inputError.name': false
    })
    
    if (e.detail.value !== '') {
      this.setData({
        'formData.name': e.detail.value
      });
    } else {
      this.setData({
        'formData.name': null
      });
    }
   
  },

  /**
   * 清空输入框
   */
  clearInput: function (e) {
    this.setData({
      errorData: null,
      'inputError.name': null,
      'formData.name': null
    })
    
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
        if (res.data.result) {
          that.setData({
            empInfo: res.data.result,
            'formData.name': res.data.result.name
          });
        }
        
      }
    })
  }


})