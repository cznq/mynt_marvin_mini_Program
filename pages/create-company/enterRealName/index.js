var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({
  data: {
    mainTitle: '输入真实姓名',
    button_text: '下一步',
    isfocus: true
  },
  onLoad: function(options) {
    var _this = this;
    //_this.data.company_verify_code = options.company_verify_code;
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
          method: 'update_employee',
          data: JSON.stringify({
            union_id: wx.getStorageSync('xy_session'),
            name: realName,
            avatar: wx.getStorageSync('avatar')
          })
        },
        success: res => {
          console.log(res);
          res.data.sub_code = 0;
          if (res.data.sub_code == 0){
             wx.navigateTo({
              url: '../enterpriseInformation/index',
            })
          }else{
            console.log("返回数据错误");
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