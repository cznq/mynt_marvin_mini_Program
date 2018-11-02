var app = getApp()
Page({
  data: {
    islogin: false,
    isexamine: false,
    iswebview: false,
    timestamp: null,
    web_url: app.globalData.WEB_VIEW_URL,
    title: '欢迎使用小觅楼宇服务',
    introduce: '加入一个公司并开始享受高端楼宇服务，包括邀请访客、员工快速发卡等',
    copy: '公司还未入驻. ',
    copy2: '新建公司',
    button_text: '加入公司',
    button_text_qx: '取消申请'
  },
  onLoad: function(options) {
    var _this = this;
    //检测登陆
    if (!(app.checkSession())) {
      app.checkLogin().then(function(res) {
        var union_id = wx.getStorageSync('xy_session');
        _this.get_review_status(_this, union_id);
      })
    } else {
      var union_id = wx.getStorageSync('xy_session');
      _this.get_review_status(_this, union_id);
    }
  },
  //获取用户信息
  get_review_status: function(_this, union_id) {
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
          if (resdata) {
            if (resdata.employee_status == '' || resdata.employee_status == 1 || resdata.employee_status == 3 || resdata.employee_status == 4) {
              console.log('小机器人');
              _this.setData({
                islogin: true
              })
            } else if (resdata.role == 0 && resdata.employee_status == 2) {
              console.log('审核中页面');
              _this.setData({
                isexamine: true,
                company_name: resdata.company_name,
                name: resdata.name
              })
            } else if (resdata.role == 1 || resdata.role == 2 || resdata.role == 3 && resdata.employee_status == 0) {
              console.log('webview');
              _this.setData({
                iswebview: true
              })
            }
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
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  }
})