var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    mainTitle: '输入真实姓名',
    button_text: '下一步',
    isfocus: true,
    CstateCode:1,//1为创建 2为编辑
    company_verify_code:''
  },
  onLoad: function(options) {
    var _this = this;
    _this.data.company_verify_code = options.company_verify_code;

    //检测登陆
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {})
    }

  },
  //提交数据
  formSubmit: function(e) {
    var _this = this;
    //获取真实姓名
    var realName = e.detail.value.realName;
    if (realName !== '') {
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'bind_admin',
          data: JSON.stringify({
            company_verify_code: _this.data.company_verify_code,
            union_id: wx.getStorageSync('xy_session'),
            open_id: wx.getStorageSync('open_id'),
            name: realName,
            avatar: wx.getStorageSync('avatar'),
            open_id_type: app.globalData.open_id_type
          })
        },
        success: res => {
          console.log(res);
          if (res.data.sub_code == 0){
            wx.redirectTo({
               url: '../guide/index?CstateCode= ' + _this.data.CstateCode,
            })
          } else {
            console.log(res.data.sub_msg);
            toast.showToast(this, {
              toastStyle: 'toast',
              title: res.data.sub_msg,
              duration: 2000,
              mask: false,
              cb: function () {
                _this.setData({
                  isfocus: true
                })
              }
            });
          }
        },
        fail: res => {
          console.log('fail');
        }
      })
    } else {
      toast.showToast(this, {
        toastStyle: 'toast',
        title: '姓名不能为空哦',
        duration: 2000,
        mask: false,
        cb: function() {
          _this.setData({
            isfocus: true
          })
        }
      });
    }
  }
})