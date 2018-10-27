var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '输入真实姓名',
    button_text: '下一步',
    isfocus: true,
    company_verify_code: '111'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.data.company_verify_code = options.company_verify_code;
  },
  formSubmit: function(e) {
    var that = this;
    var realName = e.detail.value.realName;

    if (realName !== '') {
      //不为空提交
      var company_verify_code = that.data.company_verify_code,
        union_id = wx.getStorageSync('xy_session'),
        open_id = "65effd5a42fd1870b2c7c5343640e9a8",
        name = realName,
        avatar = wx.getStorageSync('avatar'),
        open_id_type = 1;
        console.log(company_verify_code, union_id, open_id, name, avatar, open_id_type);

      //请求
      app.Util.network.POST({
        url: app.globalData.BENIFIT_API_URL,
        params: {
          service: 'company',
          method: 'update_employee',
          data: JSON.stringify({
            company_verify_code: company_verify_code,
            union_id: union_id,
            open_id: open_id,
            name: name,
            avatar: avatar,
            open_id_type: 1
          })
        },
        success: res => {
          var resdata = res.data.result;
          if (resdata) {
            // wx.navigateTo({
            //   url: '../information/index',
            // })
          }
        },
        fail: res => {
          console.log('fail');
        }
      })
      
      /**test 模块 */
      wx.navigateTo({
        url: '../information/index',
      })

    } else {
      toast.showToast(this, {
        toastStyle: 'toast',
        title: '姓名不能为空哦',
        duration: 2000,
        mask: false,
        cb: function() {
          that.setData({
            isfocus: true
          })
        }
      });
    }


  }

})