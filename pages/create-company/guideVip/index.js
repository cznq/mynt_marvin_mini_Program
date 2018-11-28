// pages/create-company/guideVip/index.js
var app = getApp();
Page({
  data: {
    CstateCode:1,
    cd:{},
    button_text:'上传信息，试用企业主页'
  },
  onLoad: function (options) {
    var _this = this;
    _this.data.CstateCode = options.CstateCode;
    if (options.CstateCode == 1) {
      wx.setNavigationBarTitle({
        title: '创建公司'
      })
    } else if (options.CstateCode == 2) {
      wx.setNavigationBarTitle({
        title: '编辑企业信息'
      })
    }
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_company_service_status',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          service_key:"COMPANY_INTRODUCE_MEDIA"
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code == 0) {
          switch (res.data.result.service_status) {
            case 0:
              wx.navigateTo({
                url: '/pages/invite-visitor/start/index',
              })
              break;
            case 1:
              _this.setData({
                button_text: '立即上传'
              })
              break;
            default:
              _this.setData({
                button_text: '立即上传上传信息，试用企业主页'
              })
          }
          
        } else {
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code == 0) {
          //res.data.result.service_suite=1;
          _this.setData({
            cd: res.data.result
          })
        } else {
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  next:function(){
    var _this = this;
    wx.navigateTo({
      url: '../vipInformation/index?CstateCode=' + _this.data.CstateCode,
    })
  }
})