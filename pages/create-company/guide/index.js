// pages/create-company/guide/index.js
var app = getApp();
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    button_text: "完成并预览",
    CstateCode: 1,
    cd: {},
    company_name:'',
    company_short_name:''
  },
  onLoad: function(options) {
    var _this = this;
    _this.data.CstateCode = options.CstateCode;
    _this.setData({
      company_name: options.company_name,
      company_short_name: options.company_short_name
    })
    if (options.CstateCode == 1) {
      wx.setNavigationBarTitle({
        title: '创建公司'
      })
      _this.setData({
        button_text: '完成并预览'
      })
    } else if (options.CstateCode == 2) {
      wx.setNavigationBarTitle({
        title: '编辑企业信息'
      })
      _this.setData({
        button_text: '完成'
      })
    }
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
  //编辑基础信息
  basicInformation: function() {
    var _this = this;
    wx.navigateTo({
      url: '../basicInformation/index?CstateCode= ' + _this.data.CstateCode,
    })
  },
  //编辑vip信息
  guideVip: function() {
    var _this = this;

    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_company_service_status',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          service_key: "COMPANY_INTRODUCE_MEDIA"
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code == 0) {
         
          switch (res.data.result.service_status) {
            case 0:
              wx.navigateTo({
                // url: '/pages/invite-visitor/start/index',
                url: '../guideVip/index?CstateCode= ' + _this.data.CstateCode + '&service_status=' + res.data.result.service_status+'&button_text=了解小觅商业服务套件',
              })
              break;
            case 1:
              wx.navigateTo({
                url: '../guideVip/index?CstateCode= ' + _this.data.CstateCode + '&service_status=' + res.data.result.service_status +'&button_text=立即上传',
              })
              break;
            default:
              wx.navigateTo({
                url: '../guideVip/index?CstateCode= ' + _this.data.CstateCode + '&service_status=' + res.data.result.service_status + '&button_text=立即上传，试用企业主页',
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


    
  },
  next: function() {
    var _this = this;
    if (_this.data.CstateCode == 1) {
      //创建公司
      wx.navigateTo({
        url: '../companyPages/index?CstateCode= ' + _this.data.CstateCode,
      })
    } else if (_this.data.CstateCode == 2) {
      //编辑公司
      wx.navigateBack({
        url: '../editCompanyPages/index?CstateCode= ' + _this.data.CstateCode,
      })
    }
  }
})