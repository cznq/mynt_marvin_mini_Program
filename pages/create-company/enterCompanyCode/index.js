var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({
  data: {
    mainTitle: '输入公司码',
    hint: '公司码需向楼宇管理申领\n服务热线：0510-88877799',
    codevalue:'',
    isfocus:true
  },
  companyCode: function(e) {
    var _this = this;
    if (e.detail.value.length == 8) {
      var company_verify_code = e.detail.value,
        union_id = wx.getStorageSync('xy_session'),
        open_id = wx.getStorageSync('open_id'),
        name = wx.getStorageSync('nickname'),
        avatar = wx.getStorageSync('avatar'),
        open_id_type = 1;
      //请求
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'bind_admin',
          data: JSON.stringify({
            company_verify_code: company_verify_code,
            union_id: union_id,
            open_id: open_id,
            name: name,
            avatar: avatar,
            open_id_type: app.globalData.open_id_type
          })
        },
        success: res => {
          console.log(res);
          res.data.sub_code = 0;//testdata
          if (res.data.sub_code == 0) {
            wx.navigateTo({
              url: '../enterRealName/index?company_verify_code=' + company_verify_code,
            })
          }else{
            _this.setData({
              isfocus: false
            })
            toast.showToast(this, {
              toastStyle: 'toast',
              title: '你输入的码有误,请重新输入',
              duration: 2000,
              mask: false,
              cb: function () {
                _this.setData({
                  codevalue: '',
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
    }
  }
})