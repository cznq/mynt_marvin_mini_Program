var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({
  data: {
    mainTitle: '输入公司码',
    hint: '公司码需向楼宇管理申领\n服务热线：0571-82617637',
    codevalue: '',
    isfocus: true
  },
  companyCode: function(e) {
    var _this = this;
    var company_verify_code = e.detail.value.replace(/\s/ig, '');
    //判断公司码不能为汉字
    if (app.Util.checkCode(company_verify_code) == true) {
      _this.setData({
        isfocus: false
      })
      toast.showToast(this, {
        toastStyle: 'toast',
        title: '你输入的码有误,请重新输入',
        duration: 2000,
        mask: false,
        cb: function() {
          _this.setData({
            codevalue: '',
            isfocus: true
          })
        }
      });
    }
    //判断公司码8位输入完请求
    if (company_verify_code.length == 8) {
      var company_verify_code = company_verify_code,
        union_id = wx.getStorageSync('xy_session')

      //请求
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'get_company_info',
          data: JSON.stringify({
            company_verify_code: company_verify_code,
            union_id: union_id
          })
        },
        success: res => {
          console.log(res);
          if (res.data.sub_code == 0) {
            wx.redirectTo({
              url: '../enterRealName/index?company_verify_code=' + company_verify_code,
            })
          } else {
            _this.setData({
              isfocus: false
            })
            toast.showToast(this, {
              toastStyle: 'toast',
              title: '你输入的码有误,请重新输入',
              duration: 2000,
              mask: false,
              cb: function() {
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