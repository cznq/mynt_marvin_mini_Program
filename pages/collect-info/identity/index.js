
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    xy_session: null,
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
    this.showInfo('#ib2', 'jdjdjdjdjdj');
  },

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
          bgcolor: 'rgba(252, 252, 252, 1)',
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

  checkParam(phone, id_number) {
    var idcard_reg = app.Util.checkID(id_number) || app.Util.checkPassport(id_number);
    if (app.Util.checkPhone(phone) === false) {
      this.showError('#ib1', '请输入正确的手机号');
      return false;
    } else if (idcard_reg === false) {
      this.showError('#ib2', '请输入有效的证件号');
      return false;
    }
    return true;
  },

  getVisitorinfo: function () {
    var that = this;
    var unionId = that.data.xy_session;
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
        if (res.data.result.id_number !== "" && res.data.result.id_number !== null) {
          wx.redirectTo({
            url: '/pages/collect-info/face/index?invitation_id=' + that.data.invitation_id + '&company_id=' + this.data.company_id + '&vip=' + that.data.vip,
          })
        }

      }
    })
  },

  getEmployeeinfo: function () {
    var that = this;
    var unionId = that.data.xy_session;
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
        if (res.data.result.id_number !== "" && res.data.result.id_number !== null) {
          wx.redirectTo({
            url: '/pages/collect-info/face/index?invitation_id=' + that.data.invitation_id + '&company_id=' + this.data.company_id + '&vip=' + that.data.vip,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log(this.data.invitation_id);
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.setData({
          xy_session: wx.getStorageSync('xy_session')
        })
        if (that.data.invitation_id !== null && that.data.invitation_id !== undefined && that.data.invitation_id !== "undefined") {
          that.getVisitorinfo();
        } else {
          that.getEmployeeinfo();
        }
      })
    } else {
      that.setData({
        xy_session: wx.getStorageSync('xy_session')
      })
      if (that.data.invitation_id !== null && that.data.invitation_id !== undefined && that.data.invitation_id !== "undefined") {
        that.getVisitorinfo();
      } else {
        that.getEmployeeinfo();
      }
    }

  }


})