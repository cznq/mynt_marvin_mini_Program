
const app = getApp();
Page({

  /**
   * 录入身份信息公共页面
   * 邀请流程，员工快捷取卡
   * Param: 
   * invitation_id   邀请id
   * vip   是否VIP邀请
   * company_id   公司id
   * 
   */

  data: {
    invitation_id: null,
    vip: null,
    company_id: null,
    formData: {
      phone: null,
      id_number: null
    },
    inputError: {
      phone: false,
      id_number: false
    },
    errorData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      vip: options.vip,
      company_id: options.company_id,
      invitation_id: options.invitation_id
    })
    this.showInfo('#ib2', '录入信息后可以让机器人认出你，并为您提供快捷取卡等服务，同时也是员工身份的证明');
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
   * 错误提示
   */
  showInfo: function (id, txt) {
    var _this = this;
    const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      _this.setData({
        errorData: {
          top: res[0].bottom + 10,
          text: txt,
          bgcolor: '#f2f3f6',
          txtcolor: 'rgba(136, 145, 169, 1)'
        }
      })
    })
  },

  editSubmit: function (e) {
    var id_type = 0;
    var phone = e.detail.value.phone;
    var id_number = e.detail.value.id_number;
    if (app.Util.checkPassport(id_number)) {
      var id_type = 1;
    }
    if (isNaN(this.data.invitation_id)) {
      var service = 'company';
      var method = 'update_employee';
    } else {
      var service = 'visitor';
      var method = 'bind';
    }
    if (this.checkParam(phone, id_number)) {
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: service,
          method: method,
          data: JSON.stringify({
            union_id: wx.getStorageSync('xy_session'),
            id_type: id_type,
            phone: phone,
            id_number: id_number
          })
        },
        success: res => {
          if (res.data.sub_code == 0) {
            wx.redirectTo({
              url: '/pages/collect-info/face/index?invitation_id=' + this.data.invitation_id + '&company_id=' + this.data.company_id + '&vip=' + this.data.vip,
            })
          } else {
            app.globalData.fundebug.notify("提交身份信息", res.data.error_msg);
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
   * 检测表单可提交状态
   */
  checkForm: function (e) {
    console.log(e);
    var val = app.Util.filterEmoji(e.detail.value);
    if (e.currentTarget.id == 'i1') {
      if (e.detail.value !== '') {
        this.setData({
          'formData.phone': e.detail.value
        });
      } else {
        this.setData({
          'formData.phone': null
        });
      } 
    }
    if (e.currentTarget.id == 'i2') {
      if (e.detail.value !== '') {
        this.setData({
          'formData.id_number': e.detail.value
        });
      } else {
        this.setData({
          'formData.id_number': null
        });
      } 
    }
  },

  /**
   * 检测提交参数
   */
  checkParam(phone, id_number) {
    var idcard_reg = app.Util.checkID(id_number) || app.Util.checkPassport(id_number);
    if (app.Util.checkPhone(phone) === false) {
      this.setData({
        'inputError.phone': true,
        'inputError.id_number': false
      });
      this.showError('#ib1', '请输入正确的手机号');
      return false;
    } else if (idcard_reg === false) {
      this.setData({
        'inputError.phone': false,
        'inputError.id_number': true
      });
      this.showError('#ib2', '请输入有效的证件号');
      return false;
    }
    return true;
  },

  /**
   * 清空输入框
   */
  clearInput: function (e) {
    console.log(e);
    var bid = e.currentTarget.id;
    if (bid == 'b1') {
      this.setData({
        'formData.phone': null
      })
    }
    if (bid == 'b2') {
      this.setData({
        'formData.id_number': null
      })
    }
  },

  /**
   * 输入框失去焦点，清除按钮消失
   */
  loseFocus: function () {

  },

  /**
   * 获取访客信息
   */
  getVisitorInfo: function () {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_visitor_info',
        data: JSON.stringify({
          union_id: unionId
        })
      },
      success: res => {
        if (res.data.sub_code == 100013) {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none'
          })
          return false;
        }
        if (res.data.result && !app.Util.checkEmpty(res.data.result.id_number)) {
          wx.redirectTo({
            url: '/pages/collect-info/face/index?invitation_id=' + that.data.invitation_id + '&company_id=' + this.data.company_id + '&vip=' + that.data.vip,
          })
        }

      }
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
        if (res.data.sub_code == 100013) {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none'
          })
          return false;
        }
        if (!app.Util.checkEmpty(res.data.result.id_number)) {
          wx.redirectTo({
            url: '/pages/collect-info/face/index?invitation_id=' + that.data.invitation_id + '&company_id=' + this.data.company_id + '&vip=' + that.data.vip,
          })
        }
      }
    })
  },

  getStaffInfo: function () {
    if (this.data.invitation_id !== null && this.data.invitation_id !== undefined && this.data.invitation_id !== "undefined") {
      this.getVisitorInfo();
    } else {
      this.getEmployeeInfo();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getStaffInfo();
      })
    } else {
      that.getStaffInfo();
    }

  }


})