var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({
  data: {
    mainTitle: '确认加入此公司',
    button_text: '下一步',
    hint: '二维码与邀请码来自于企业内部人员的分享,可\n向企业员工或管理员索要',
    company_code: '',
    showLoginModal:false
  },
  bindGetUserInfo: function () {
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
              app.authorizeLogin(res.encryptedData, res.iv, () => {
                that.get_info();
              });
            }
          })
        }
      }
    })
  },
  onLoad: function(options) {
    var _this = this;
    //检测登陆
    if (!(app.checkSession())) {
      app.checkLogin().then(function(res) {
        if (!(app.checkSession())) {
          _this.setData({
            showLoginModal: true
          })
        } else {
          _this.get_info();
        }
      })
    }else{
      _this.get_info();
    }
    if (!options.company_code) {
      _this.data.company_code = decodeURIComponent(options.scene);
    } else {
      _this.data.company_code = options.company_code;
    }
    

  },
  get_info:function(){
    var _this = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_review_status',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res);
        var resdata = res.data.result;
        if (res.data.sub_code == 0) {
          if (resdata.employee_status === 2 || resdata.employee_status === 0) {
            wx.reLaunch({
              url: '../../../manage/manage',
            })
          } else {
            app.Util.network.POST({
              url: app.globalData.BASE_API_URL,
              params: {
                service: 'company',
                method: 'get_company_info',
                data: JSON.stringify({
                  union_id: wx.getStorageSync('xy_session'),
                  company_code: _this.data.company_code
                })
              },
              success: res => {
                console.log(res);
                if (res.data.sub_code == 0) {
                  console.log('数据成功');
                  _this.setData({
                    cd: res.data.result
                  })
                } else {
                  console.log(res.data.sub_msg);
                  toast.showToast(this, {
                    toastStyle: 'toast',
                    title: res.data.sub_msg,
                    duration: 1000,
                    mask: false,
                    cb: function () {
                      wx.reLaunch({
                        url: '../choiceJoin/index',
                      })
                    }
                  });
                }
              },
              fail: res => {
                console.log('fail');
              }
            })
          }
        } else {
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  receiveSubmit: function (e) {
    var _this = this;
    var form_id = e.detail.formId;
    console.log(form_id)
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        if (!(app.checkSession())) {
          _this.setData({
            showLoginModal: true
          })
        } else {
          wx.navigateTo({
            url: '../enterRealName/index?company_code=' + _this.data.company_code + '&form_id=' + form_id
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../enterRealName/index?company_code=' + _this.data.company_code + '&form_id=' + form_id
      })
    }

  }
})