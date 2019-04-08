// pages/create-company/guideVip/index.js
var app = getApp();
Page({
  data: {
    CstateCode: 1,
    cd: {},
    businessVip_status: 0,
    button_text: '',
    isvip_button: false,
    imageUrl: app.globalData.BASE_IMG_URl + 'company_homepage@2x.png'
  },
  onLoad: function(options) {
    var _this = this;
    //_this.data.CstateCode = options.CstateCode;
    if (options.service_status == 0) {
      _this.setData({
        isvip_button: true
      })
    }
    _this.setData({
      button_text: options.button_text
    })
    _this.data.button_text = options.button_text;
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
        _this.getServiceStatus(_this);
      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  /**
   * 获取商业服务套件的状态
   */
  getServiceStatus: function(that) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_business_service_suite_status',
        data: JSON.stringify({}),
      },
      success: res => {
        // console.log("商业服务套件的状态:", res);
        if (res.data.return_code === "SUCCESS") {
          let data = res.data
          that.setData({
            businessVip_status: data.result.business_service_suite_status,
          })

        }

      }
    })
  },
  next: function() {
    var _this = this;
    wx.redirectTo({
      url: '../vipInformation/index?CstateCode=' + _this.data.CstateCode,
    })
  },
  next2: function() {
    wx.navigateTo({
      url: '/pages/businessService/suite-introduce/suite-introduce',
    })
  }
})