const app = getApp();
Page({

  data: {
    isIphoneX: app.globalData.isIphoneX,
    formData: {
      name: null,
      phone: null
    },
    inputError: {
      name: false,
      phone: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

  },

  editSubmit: function (e) {
    var _this = this
    var phone_reg = app.Util.checkPhone(_this.data.formData.phone);
    if (phone_reg === false) {
      _this.setData({
        'inputError.phone': true
      });
      return ;
    }
  
    app.Util.networkUrl.postUrl({
      url: app.globalData.BASE_ASSET_URL + '/employee/add',
      params: {
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          name: _this.data.formData.name,
          phone: _this.data.formData.phone,
          role: 0
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {}
        wx.redirectTo({
          url: '../invite/index?employee_id=',
        })  
        
      }
    })
    
  },

  /**
   * 检测表单可提交状态
   */
  checkForm: function (e) {
    console.log(e.currentTarget.id)
    if (e.currentTarget.id == 'i1') {
      this.setData({
        'inputError.name': false,
        'formData.name': e.detail.value
      })
    } else if (e.currentTarget.id == 'i2') {
      this.setData({
        'inputError.phone': false,
        'formData.phone': e.detail.value
      })
    }
    
  }


})