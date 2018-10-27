var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '输入公司码',
    hint: '公司码需向楼宇管理申领\n服务热线：0510-88877799',
    codevalue:'',
    isfocus:true
  },
  companyCode: function(e) {
    var that = this;
    if (e.detail.value.length == 8) {
      var company_verify_code = e.detail.value,
        union_id = wx.getStorageSync('xy_session'),
        open_id = "65effd5a42fd1870b2c7c5343640e9a8",
        name = wx.getStorageSync('nickname'),
        avatar = wx.getStorageSync('avatar'),
        open_id_type = 1;


      console.log(company_verify_code, union_id, open_id, name, avatar, open_id_type);



      /** 请求成功后执行模块 */

              /* ===== test data ==== */
              var resdata_z = 1;
              /* ======test data ==== */


              if (resdata_z == 1){

                wx.navigateTo({
                  url: '../name/index?company_verify_code=' + company_verify_code,
                })
              }else{
                that.setData({
                  isfocus : false
                })
                toast.showToast(this, {
                  toastStyle: 'toast',
                  title: '你输入的码有误,请重新输入',
                  duration: 2000,
                  mask: false,
                  cb: function () {
                    that.setData({
                      codevalue: '',
                      isfocus:true
                    })
                  }
                });
              }
      /** 请求成功后执行模块 */


      //请求
      app.Util.network.POST({
        url: app.globalData.BENIFIT_API_URL,
        params: {
          service: 'company',
          method: 'bind_admin',
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
            console.log(resdata.role);
          }
        },
        fail: res => {
          console.log('fail');
        }
      })
    }
  }

})