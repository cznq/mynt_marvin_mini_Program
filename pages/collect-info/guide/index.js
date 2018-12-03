const app = getApp();

Page({

  /**
   * 录入身份信息公共页面
   * 邀请流程，员工快捷取卡，员工信息修改，申请发卡，协议商户
   * Param: 
   *   source (来源) | params (参数)                               | callback（回调）
   *   invite       | form_id                                     | /pages/invite-visitor/success/index?invitation_id
   *   takeCard     | card_type                                   | /pages/employee/take-card/success/index 或者  /pages/e-card/detail/index
   *   editInfo     |                                             | /pages/employee/homepage/index
   *   applyVisit   |  company_id, form_id, visitor_name, note    | /pages/apply-visit/applicationStatus/index?visit_apply_id
   *   benifit      |  commerce_id                                | /benifit/pages/vip-card/vip-card
   */

  data: {
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.options.source = options.source;
    this.data.options.params = options.params;
    
  },

  startRecodeInfo: function () {
    wx.navigateTo({
      url: '/pages/collect-info/identity/index?source=' + this.data.options.source + '&params=' + this.data.options.params
    })
  }




})