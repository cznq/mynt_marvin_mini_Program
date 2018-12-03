var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({
  data: {
    mainTitle: '输入邀请码',
    hint: '二维码与邀请码来自于企业内部人员的分享,可\n向企业员工或管理员索要',
    codevalue: '',
    isfocus: true
  },
  companyCode: function (e) {
    var _this = this;
    var company_code = e.detail.value.replace(/\s/ig, '');
    //判断公司码不能为汉字
    if (app.Util.checkCode(company_code) == true) {
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
    //判断公司码8位输入完请求
    if (company_code.length == 8) {
      var company_code = company_code;
      var union_id = wx.getStorageSync('xy_session');
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'get_company_info',
          data: JSON.stringify({
            company_code: company_code,
            union_id: union_id
          })
        },
        success: res => {
          if (res.data.sub_code == 0) {
            wx.navigateTo({
              url: '../confirmCompanyInformation/index?company_code=' + company_code,
            })
          } else {
            _this.setData({
              isfocus: false
            })
            toast.showToast(_this, {
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