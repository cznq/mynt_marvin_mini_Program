var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({
  data: {
    mainTitle: '选择一种方式加入',
    button_text: '下一步',
    hint: '二维码与邀请码来自于企业内部人员的分享,可\n向企业员工或管理员索要'
  },
  bindcode: function() {
    wx.navigateTo({
      url: '../invitationCode/index',
    })
  },
  bindscan: function() {
    var _this = this;
    //呼起扫一扫
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var company_code = res.result;
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
            //console.log(res);
            if (res.data.sub_code == 0) {
              wx.navigateTo({
                url: '../confirmCompanyInformation/index?company_code=' + company_code
              })
            } else {
              console.log(res.data.sub_msg);
              toast.showToast(_this, {
                toastStyle: 'toast',
                title: '您扫描的二维码有误，请重新扫描',
                duration: 3000,
                mask: false
              });
            }
          },
          fail: res => {
            console.log('fail');
          }
        })
      }
    })
  }
})