var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '输入邀请码',
    hint: '二维码与邀请码来自于企业内部人员的分享,可n\向企业员工或管理员索要',
    codevalue: '',
    button_text: '下一步',
    isfocus: true
  },
  onLoad:function(){

    
  },
  companyCode: function (e) {
    var that = this;
    //判断输入8位 成功后跳转
    if (e.detail.value.length == 8) {
      
      //获取基本信息
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


      if (resdata_z == 1) {
        //成功跳转
        wx.navigateTo({
          url: '../confirm/index?company_verify_code=' + company_verify_code,
        })
      } else {
        that.setData({
          isfocus: false
        })
        toast.showToast(this, {
          toastStyle: 'toast',
          title: '你输入的码有误,请重新输入',
          duration: 2000,
          mask: false,
          cb: function () {
            that.setData({
              codevalue: '',
              isfocus: true
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