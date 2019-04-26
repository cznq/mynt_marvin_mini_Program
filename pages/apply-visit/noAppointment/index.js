// pages/apply-visit/noAppointment/index.js
var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    version: app.globalData.version,
    cd: {},
    company_code:'',
    qr_code_key:'',
    button_text: '申请访问该企业',
    buttonDisable: true,
    isCoverView: false  //视频全屏cover-view隐藏
  },
  //机器人端二维码隐藏
  updateQrcodeStatus(qr_code_key) {
    var _this = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'save_qr_code_key',
        data: JSON.stringify({
          union_id: unionId,
          qr_code_key: qr_code_key
        })
      },
      success: res => {
        console.log('key', res)
      }
    })
  },
  onLoad: function(options) {
    var _this = this;
    var scene_str = decodeURIComponent(options.scene);
    console.log(options.scene);
    if (scene_str !== 'undefined' && scene_str !== undefined) {
      _this.data.company_code = scene_str.split('_')[0];
      _this.data.qr_code_key = scene_str.split('_')[1];
    } else {
      wx.showToast({
        title: '识别二维码出错，请重新扫码',
      })
      app.myLog("扫码二维码出错", "申请发卡扫码二维码未识别公司ID");
    }
    //机器人端二维码消失
    _this.updateQrcodeStatus(_this.data.qr_code_key);

    //请求数据
    companyPage.cd(_this, app, "company", "get_company_info", _this.data.company_code, function() {
      wx.setNavigationBarTitle({
        title: _this.data.cd.company_short_name
      })
      _this.setData({
        buttonDisable: false
      })
    });
    setTimeout(function () {
      _this.setData({
        isCoverView: true
      })
    }, 1000);
  },
  // 机器人端预览
  robotPreview: function() {
    companyPage.robotPreview(this);
  },
  // 简介展开功能
  introductionAll: function() {
    companyPage.introductionAll(this);
  },
  //分享
  onShareAppMessage: function(res) {
    var message = companyPage.shareMessage(this);
    return {
      title: message[0],
      path: message[1],
      imageUrl: message[2],
    }
  },
  //视频全屏cover-view隐藏
  fullScreen: function (e) {
    var _this = this;
    if (e.detail.fullScreen) {
      _this.setData({
        isCoverView: false
      })
    } else {
      _this.setData({
        isCoverView: true
      })
    }
  },
  next: function() {
    var _this = this;
    wx.navigateTo({
      url: '../reasonsVisiting/index?company_id=' + _this.data.cd.company_id + '&is_force_visitor_input_info=' + _this.data.cd.is_force_visitor_input_info + '&take_card_ways=' + _this.data.cd.take_card_ways + '&company_code=' + _this.data.company_code,
    })
    
  }
})