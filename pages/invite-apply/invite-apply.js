// pages/invite-apply/invite-apply.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xy_session: null,
    company_id: null,
    visitorInfo: null,
    noteCount: 0,
    showLoginModal: false
  },

  applySubmit: function (e) {
    var that = this;
    var id_type = 0;
    var visitor_name = e.detail.value.visitor_name;
    var phone = e.detail.value.phone;
    var id_number = e.detail.value.id_number;
    var note = e.detail.value.note;
    var form_id = e.detail.formId;
    if (app.Util.checkID(id_number)) {
      var id_type = 0;
    } else if (app.Util.checkPassport(id_number)) {
      var id_type = 1;
    }
    if (that.checkParam(visitor_name, phone, id_number, note)) {
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'visitor',
          method: 'visit_apply',
          union_id: wx.getStorageSync('xy_session'),
          data: JSON.stringify({
            form_id: form_id,
            visit_company_id: that.data.company_id,
            visitor_name: visitor_name,
            id_type: id_type,
            phone: phone,
            id_number: id_number,
            note: note
          })
        },
        success: res => {
          if (res.data.sub_code == 0) {
            if (that.data.visitorInfo == null) {
              that.getVisitorinfo().then(function(){
                if (that.data.visitorInfo.input_pic_url !== null && that.data.visitorInfo.input_pic_url !== "") {
                  wx.redirectTo({
                    url: '/pages/invite-apply-result/invite-apply-result?visit_apply_id=' + res.data.result.visit_apply_id + '&company_id=' + that.data.company_id,
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/invite-accept/invite-accept?visit_apply_id=' + res.data.result.visit_apply_id + '&company_id=' + that.data.company_id,
                  })
                }
              })
            } else {
              if (that.data.visitorInfo.input_pic_url !== null && that.data.visitorInfo.input_pic_url !== "") {
                wx.redirectTo({
                  url: '/pages/invite-apply-result/invite-apply-result?visit_apply_id=' + res.data.result.visit_apply_id + '&company_id=' + that.data.company_id,
                })
              } else {
                wx.redirectTo({
                  url: '/pages/invite-accept/invite-accept?visit_apply_id=' + res.data.result.visit_apply_id + '&company_id=' + that.data.company_id,
                })
              }
            }
          } else {
            wx.showModal({
              content: '提交失败',
              showCancel: false
            })
          }
        }
      })
    }
  },

  countFontNum: function(e) {
    var that = this;
    that.setData({
      noteCount: e.detail.value.length
    })
  },

  getVisitorinfo: function () {
    console.log("userinfo");
    var that = this;
    return new Promise(function (resolve, reject) {
      if (!that.data.visitorInfo) {
        var unionId = wx.getStorageSync('xy_session');
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'visitor',
            method: 'get_visitor_info',
            union_id: unionId,
            data: JSON.stringify({
              visit_company_id: that.data.company_id
            })
          },
          success: res => {
            if (res.data.result !== null && res.data.result !== undefined) {
              that.setData({
                visitorInfo: res.data.result
              })
            }
            resolve();
          }
        })
      } else {
      }
    })
  },

  checkParam(visitor_name, phone, id_number, note) {
    var idcard_reg = app.Util.checkID(id_number) || app.Util.checkPassport(id_number);
    if (visitor_name == "") {
      wx.showModal({
        content: '请输入您的姓名',
        showCancel: false
      })
      return false;
    } else if (app.Util.checkPhone(phone) === false) {
      wx.showModal({
        content: '请输入正确的手机号',
        showCancel: false
      })
      return false;
    } else if (idcard_reg === false) {
      wx.showModal({
        content: '请输入有效的证件号',
        showCancel: false
      })
      return false;
    } 
    return true;
  },

  updateQrcodeStatus(qr_code_key) {
    var that = this;
    var unionId = that.data.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'save_qr_code_key',
        union_id: unionId,
        data: JSON.stringify({
          qr_code_key: qr_code_key
        })
      },
      success: res => {
        console.log(res)
      }
    })
  },

  bindGetUserInfo: function() {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.setData({
                showLoginModal: false
              })
              app.authorizeLogin(res.encryptedData, res.iv, () => {that.getVisitorinfo()});
            }
          })
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var scene_str = decodeURIComponent(options.scene);
    if (scene_str !== undefined) { 
      var company_id = scene_str.split('_')[0];
      var qr_code_key = scene_str.split('_')[1];
    }
    wx.removeStorageSync('xy_session');
    console.log("Company id" + company_id + "key" + qr_code_key);
    that.updateQrcodeStatus(qr_code_key);
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        console.log(wx.getStorageSync('xy_session'));
        if (wx.getStorageSync('xy_session') == null || wx.getStorageSync('xy_session') == "") {
          that.setData({
            showLoginModal: true,
            company_id: company_id
          })
        } else {
          that.setData({
            company_id: company_id,
            xy_session: wx.getStorageSync('xy_session')
          })
          that.getVisitorinfo();
        }
      })
    } else {
      that.setData({
        company_id: company_id,
        xy_session: wx.getStorageSync('xy_session')
      })
      that.getVisitorinfo();
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  }

})