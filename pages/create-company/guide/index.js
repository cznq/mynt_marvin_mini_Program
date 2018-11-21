// pages/create-company/guide/index.js
var app = getApp();
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    button_text:"完成并预览",
    CstateCode:1
  },
  onLoad: function (options) {
    var _this = this;
    _this.data.CstateCode = options.CstateCode;
    if (options.CstateCode == 1){
      wx.setNavigationBarTitle({
        title: '创建公司'
      })
      _this.setData({
        button_text:'完成并预览'
      })
    } else if (options.CstateCode == 2){
      wx.setNavigationBarTitle({
        title: '编辑企业信息'
      })
      _this.setData({
        button_text: '完成'
      })
    }
  },
  //编辑基础信息
  basicInformation:function(){
    var _this = this;
    wx.navigateTo({
      url: '../basicInformation/index?CstateCode= ' + _this.data.CstateCode,
    })
  },
  //编辑vip信息
  guideVip:function(){
    var _this = this;
    wx.navigateTo({
      url: '../guideVip/index?CstateCode= ' + _this.data.CstateCode,
    })
  },
  next:function(){
    var _this = this;
    if (_this.data.CstateCode == 1){
      //创建公司
      wx.navigateTo({
        url: '../companyPages/index?CstateCode= ' + _this.data.CstateCode,
      })
    } else if(_this.data.CstateCode == 2){
      //编辑公司
      wx.navigateTo({
        url: '../editCompanyPages/index?CstateCode= ' + _this.data.CstateCode,
      })
    }
  }
})