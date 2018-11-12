var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({
  data: {
    mainTitle: '确认加入此公司',
    button_text: '下一步',
    hint: '二维码与邀请码来自于企业内部人员的分享,可\n向企业员工或管理员索要',
    company_code: ''
  },
  onLoad: function(options) {
    var _this = this;
    //检测登陆
    if (!(app.checkSession()) || wx.getStorageSync('open_id') == '' || wx.getStorageSync('xy_session') == '') {
      app.checkLogin().then(function(res) {})
    }
    if (!options.company_code) {
      _this.data.company_code = decodeURIComponent(options.scene);
    } else {
      _this.data.company_code = options.company_code;
    }
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
          if (resdata.employee_status === 2) {
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
                    cb: function() {
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
  next: function() {
    var _this = this;
    wx.navigateTo({
      url: '../enterRealName/index?company_code=' + _this.data.company_code
    })
  }
})