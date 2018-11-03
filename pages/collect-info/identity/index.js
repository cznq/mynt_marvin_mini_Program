
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
      phone: false,
      id_number: false
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
    this.showInfo('#ib2', '在验证人脸信息的时候用到');
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
    var val = app.Util.filterEmoji(e.detail.value);
    if (e.detail.value !== '' && e.currentTarget.id == 'i1') {
      this.setData({
        'formData.phone': true
      });
    }
    if (e.detail.value !== '' && e.currentTarget.id == 'i2') {
      this.setData({
        'formData.id_number': true
      });
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
        console.log(res);
        if (!app.Util.checkEmpty(res.data.result.id_number)) {
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
        console.log(res);
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
    console.log(this.data.invitation_id);
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