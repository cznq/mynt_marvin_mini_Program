// pages/create-company/guideVip/index.js
Page({
  data: {
    CstateCode:1
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
  },
  next:function(){
    var _this = this;
    wx.navigateTo({
      url: '../vipInformation/index?CstateCode=' + _this.data.CstateCode,
    })
  }
})