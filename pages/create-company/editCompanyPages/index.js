// pages/create-company/editcompanyPages/index.js
var app = getApp();
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    CstateCode: 1,
    cd: {},
    button_text: '编辑企业信息'
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
    //请求
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
          // res.data.result.address = '';
          // res.data.result.background_url = '';
          res.data.result.introduction = 'MYNTAI（小觅智能）2014年7月成立于美国硅谷，专注立体视觉技术整体解决方案，是行业领先的视觉定位导航VPS核心技MYNTAI（小觅智能）2014年7月成立于美国硅谷，专注立体视觉技术整体解决方案，是行业领先的视觉定位导航VPS核心技MYNTAI（小觅智能）2014年7月成立于美国硅谷，专注立体视觉技术整体解决方案，是行业领先的视觉定位导航VPS核心技';
          // res.data.result.product_urls = [""];
          // res.data.result.floor = '';
          // res.data.result.room = '';
          // res.data.result.phone = '';
          // res.data.result.website = '';

          //简介展开
          if (res.data.result.introduction.length >= 68) {
            res.data.result.introductionAll = res.data.result.introduction;
            res.data.result.introduction = res.data.result.introduction.substr(0, 68) + '...';
            res.data.result.introductionAll_button = true;
          }
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
  //机器人端预览
  robotPreview: function () {
    var _this = this;
    wx.navigateTo({
      url: '../robotPreview/index?CstateCode=' + _this.data.CstateCode,
    })
  },
  //简介展开功能
  introductionAll: function () {
    var _this = this;
    _this.setData({
      'cd.introductionAll_button': false,
      'cd.introduction': _this.data.cd.introductionAll
    })
  },
  //分享
  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: _this.data.cd.company_name
    }
  },
  //编辑企业信息
  next: function () {
    var _this = this;
    wx.reLaunch({
      url: '../guide/index?CstateCode=' + _this.data.CstateCode,
    })
  }
})