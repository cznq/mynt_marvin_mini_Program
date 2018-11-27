// pages/invite-apply/invite-apply.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    var company_id = that.data.company_id;
    if (app.Util.checkID(id_number)) {
      var id_type = 0;
    } else if (app.Util.checkPassport(id_number)) {
      var id_type = 1;
    }
    if (that.checkParam(form_id, visitor_name, phone, id_number, note, company_id)) {
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'visitor',
          method: 'visit_apply',
          data: JSON.stringify({
            union_id: wx.getStorageSync('xy_session'),
            form_id: form_id,
            visit_company_id: company_id,
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
              that.getVisitorInfo().then(function(){
                if (!app.Util.checkEmpty(that.data.visitorInfo.input_pic_url)) {
                  wx.redirectTo({
                    url: '/pages/invite-apply-result/invite-apply-result?visit_apply_id=' + res.data.result.visit_apply_id + '&company_id=' + that.data.company_id,
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/collect-info/face/index?visit_apply_id=' + res.data.result.visit_apply_id + '&company_id=' + that.data.company_id,
                  })
                }
              })
            } else {
              if (!app.Util.checkEmpty(that.data.visitorInfo.input_pic_url)) {
                wx.redirectTo({
                  url: '/pages/invite-apply-result/invite-apply-result?visit_apply_id=' + res.data.result.visit_apply_id + '&company_id=' + that.data.company_id,
                })
              } else {
                wx.redirectTo({
                  url: '/pages/collect-info/face/index?visit_apply_id=' + res.data.result.visit_apply_id + '&company_id=' + that.data.company_id,
                })
              }
            }
          } else {
            wx.showModal({
              content: res.data.sub_msg,
              showCancel: false
            })
          }
        }
      })
    }
  },

  /**
   * 统计输入字数
   */
  countFontNum: function(e) {
    var that = this;
    that.setData({
      noteCount: e.detail.value.length
    })
  },

  /**
   * 获取访客信息
   */
  getVisitorInfo: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      if (!that.data.visitorInfo) {
        var unionId = wx.getStorageSync('xy_session');
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'visitor',
            method: 'get_visitor_info',
            data: JSON.stringify({
              union_id: unionId,
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

  /**
   * 检测提交数据合法性
   */
  checkParam(form_id, visitor_name, phone, id_number, note, company_id) {
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
    } else if (company_id == null) {
      wx.showModal({
        content: '获取公司ID失败，请重新扫码邀请',
        showCancel: false
      })
      return false;
    }
    return true;
  },

  updateQrcodeStatus(qr_code_key) {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'save_qr_code_key',
        data: JSON.stringify({
          union_id: unionId,
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
              app.authorizeLogin(res.encryptedData, res.iv, () => {that.getVisitorInfo()});
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
    if (scene_str !== 'undefined' && scene_str !== undefined) { 
      var company_id = scene_str.split('_')[0];
      var qr_code_key = scene_str.split('_')[1];
    } else {
      wx.showToast({
        title: '识别二维码出错，请重新扫码',
      })
      app.myLog("扫码二维码出错", "申请发卡扫码二维码未识别公司ID");
    }
    wx.removeStorageSync('xy_session');
    app.myLog('申请发卡：', "公司ID:" + company_id + " Key:" + qr_code_key);
    that.updateQrcodeStatus(qr_code_key);
    that.setData({ company_id: company_id })
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        //console.log(wx.getStorageSync('xy_session'));
        if (!(app.checkSession())) {
          that.setData({
            showLoginModal: true
          })
        } else {
          that.getVisitorInfo();
        }
      })
    } else {
      that.getVisitorInfo();
    }
  }

})