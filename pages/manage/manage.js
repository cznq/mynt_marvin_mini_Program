var app = getApp()
Page({
  data: {
    islogin: false,
    isexamine: false,
    iswebview: false,
    timestamp: null,
    showLoginModal: false,
    web_url: app.globalData.WEB_VIEW_URL,
    title: '欢迎使用小觅楼宇服务',
    introduce: '加入一个公司并开始享受高端楼宇服务，包括邀请访客、员工快速发卡等',
    copy: '公司还未入驻. ',
    copy2: '新建公司',
    button_text: '加入公司',
    button_text_qx: '取消申请'
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
                var union_id = wx.getStorageSync('xy_session');
                that.get_review_status(that, union_id);
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
    if (!(app.checkSession()) || wx.getStorageSync('open_id') == '' || wx.getStorageSync('xy_session') == '') {
      app.checkLogin().then(function(res) {
        if (!(app.checkSession())) {
          that.setData({
            showLoginModal: true
          })
        } else {
          var union_id = wx.getStorageSync('xy_session');
          _this.get_review_status(_this, union_id);
        }
      })
    } else {
      var union_id = wx.getStorageSync('xy_session');
      _this.get_review_status(_this, union_id);
    }
  },

  onShow: function () {
    this.setData({
      timestamp: Date.parse(new Date())
    })
  },
  //获取用户状态
  get_review_status: function(_this, union_id) {
    console.log(union_id+'pppppp');
    if (union_id !== '') {
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'get_review_status',
          data: JSON.stringify({
            union_id: union_id
          })
        },
        success: res => {
          console.log(res);
          var resdata = res.data.result;
          if (res.data.sub_code == 0) {
            if (resdata.employee_status === 0) {
              console.log('webview');
              _this.setData({
                iswebview: true
              })
            }
            if (resdata.employee_status === 2) {
              console.log('审核中页面');
              _this.setData({
                isexamine: true,
                company_name: resdata.company_name,
                name: resdata.name
              })
            }
            if (resdata.employee_status === "" || resdata.employee_status === 1 || resdata.employee_status === 3 || resdata.employee_status === 4) {
              console.log('小机器人');
              _this.setData({
                islogin: true
              })
            } 

          }else{
            console.log(res.data.sub_msg);
          }
        },
        fail: res => {
          console.log('fail');
        }
      })
    } else {
      wx.showToast({
        title: '授权失败，请从新登陆',
        icon: 'none',
        duration: 10000
      })
    }
  },
  //加入公司
  joinCompany: function() {
    wx.navigateTo({
      url: '../employee/join-company/choiceJoin/index'
    })
  },
  //创建公司
  createCompany: function() {
    wx.navigateTo({
      url: '../create-company/enterCompanyCode/index',
    })
  },
  //取消申请
  withdraw: function() {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'cancel_apply',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        //取消成功
        if (res.data.sub_code == 0) {
          wx.reLaunch({
            url: '../manage/manage',
          })
        } else {
          wx.showToast({
            title: '取消失败',
            icon: 'none',
            duration: 3000
          })
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  }
})