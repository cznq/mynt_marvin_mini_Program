var app = getApp()
Page({

  /**
   * 录入人脸信息公共页面
   * 邀请流程，员工快捷取卡，员工信息录入, 员工人脸修改，申请发卡，协议商户
   * Param: 
   *   source (来源) | params (参数)                               | callback（回调）
   *   invite       | form_id                                     | /pages/invite-visitor/receive/index?invitation_id
   *   takeCard     | card_type                                   | /pages/employee/take-card/open/index 或者  /pages/e-card/detail/index
   *   editInfo     | company_id                                  | /pages/employee/homepage/index
   *   reRecodeFace | company_id                                  | /pages/employee/homepage/index
   *   applyVisit   | company_id, form_id, visitor_name, note     | /pages/apply-visit/applicationStatus/index?visit_apply_id
   *   benifit      | commerce_id                                 | /benifit/pages/vip-card/vip-card
   */

  data: {
    isIphoneX: app.globalData.isIphoneX,
    options: {},
    checked: false
  },

  onLoad: function (options) {
    this.data.options.source = options.source;
    this.data.options.params = options.params;
    this.data.options.idInfo = options.idInfo;
  
  },

  //单选按钮
  radioChange: function (e) {
    if (this.data.checked) {
      this.setData({
        checked: false
      })
    } else {
      this.setData({
        checked: true
      })
    }

  },

  viewAgreement: function () {
    wx.navigateTo({
      url: '../agreement/index',
    })
  },

  startRecodeFace: function () {
    wx.navigateTo({
      url: '../reader/index?source=' + this.data.options.source + '&params=' + this.data.options.params + '&idInfo=' + this.data.options.idInfo,
    })
  },

  /**
   * 返回按钮
   */
  backAction: function () {
    wx.navigateBack({});
  }


})