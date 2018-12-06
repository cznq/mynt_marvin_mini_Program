
const app = getApp();
Page({

  data: {
    isIphoneX: app.globalData.isIphoneX,
    formData: {
      phone: null
    },
    inputError: {
      phone: false
    },
    errorData: null,
    empInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getEmployeeInfo();
  },

  editSubmit: function (e) {
    var that = this;
    var phone = e.detail.value.phone;
    if (app.Util.checkPhone(phone) === false) {
      this.setData({
        'inputError.phone': true
      });
      this.showError('#ib1', '请输入正确的手机号');
      return false;
    } else {

      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'update_employee',
          data: JSON.stringify({
            union_id: wx.getStorageSync('xy_session'),
            name: that.data.empInfo.name,
            phone: phone,
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
    }


  },

  /**
 * 提示框
 */
  showError: function (id, txt) {
    var _this = this;
    const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res);
      _this.setData({
        errorData: {
          top: res[0].bottom + 10,
          text: txt,
          bgcolor: '#fcd7d7',
          txtcolor: 'rgba(245, 113, 113, 1)'
        }
      })
    })
  },

  /**
   * 检测表单可提交状态
   */
  checkForm: function (e) {
    this.setData({
      errorData: null,
      'inputError.phone': false
    })

    if (e.detail.value !== '') {
      this.setData({
        'formData.phone': e.detail.value
      });
    } else {
      this.setData({
        'formData.phone': null
      });
    }

  },

  /**
   * 清空输入框
   */
  clearInput: function (e) {
    this.setData({
      errorData: null,
      'inputError.phone': null,
      'formData.phone': null
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
            'formData.phone': res.data.result.phone
          });
        }

      }
    })
  }


})