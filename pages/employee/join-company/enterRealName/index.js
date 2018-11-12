var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({
  data: {
    mainTitle: '输入真实姓名',
    button_text: '提交',
    codevalue: '',
    isfocus: true,
    company_code :''

  },
  onLoad: function (options) {
    var _this = this;
    _this.data.company_code = options.company_code;
    //检测登陆
    if (!(app.checkSession()) || wx.getStorageSync('open_id') == '' || wx.getStorageSync('xy_session') == '') {
      app.checkLogin().then(function (res) {})
    }
  },
  //提交数据
  formSubmit: function (e) {
    var _this = this;
    //获取真实姓名 class='cur' class='cur' class='cur' class='cur'fddddddddddd
    var realName = e.detail.value.realName;
    var form_id = e.detail.formId;
    var company_code = _this.data.company_code,
      union_id = wx.getStorageSync('xy_session'),
      open_id = wx.getStorageSync('open_id'),
      name = realName,
      avatar = wx.getStorageSync('avatar'),
      open_id_type = app.globalData.open_id_type;

    if (realName !== '') {
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'apply_join',
          data: JSON.stringify({
            company_code: company_code,
            union_id: union_id,
            open_id: open_id,
            name: realName,
            avatar: avatar,
            open_id_type: open_id_type,
            form_id: form_id
          })
        },
        success: res => {
          console.log(res);
          if (res.data.sub_code == 0) {
            wx.reLaunch({
              url: '../../../manage/manage',
            })
          } else {
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
        cb: function () {
          _this.setData({
            isfocus: true
          })
        }
      });
    }
  }
})