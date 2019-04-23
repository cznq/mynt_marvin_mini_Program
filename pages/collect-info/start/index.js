var toast = require('../../../templates/showToast/showToast');
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
    checked: false,
    error: false,
    errorCode: 0,
    errorMsg: '请将正脸置于框内，用普通话说出4位验证数字。'
  },

  onLoad: function (options) {
    this.data.options.source = options.source;
    this.data.options.params = options.params;
    this.data.options.idInfo = options.idInfo;
  
  },

  onShow: function () {
    if (this.data.error) {
      if (this.data.errorCode == '800005') {
        var title = '人脸与身份比对失败',
          pic = 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/face_error_con%402x.png'
      } else if (this.data.errorCode == '800005') {
        var title = '语音识别失败',
          pic = 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/face_error_voice@2x.png'
      } else {
        var title = '验证失败',
          pic = 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/face_error_verify@2x.png'
      }
      toast.showToast(this, {
        toastStyle: 'toast4 toast7',
        title: title,
        introduce: this.data.errorMsg,
        pic: pic,
        mask: true,
        isSure: true,
        sureText: '重新录入',
        isClose: true,
        closeText: '退出'
      });
    }
  },

  //取消关闭弹层
  bindToastClose: function () {
    toast.hideToast();
    wx.navigateBack({
      delta: 2
    })
  },
  //确定退出企业
  bindToastSure: function () {
    var _this = this;
    toast.hideToast(_this, {
      cb: function () {
        if (_this.data.errorCode == '800005') {
          wx.navigateTo({
            url: '../identity/index?source=' + _this.data.options.source + '&params=' + _this.data.options.params + '&idInfo=' + _this.data.options.idInfo
          })
        } else {
          _this.startRecodeFace();
        }
      }
    });
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
      url: '../face/index?source=' + this.data.options.source + '&params=' + this.data.options.params + '&idInfo=' + this.data.options.idInfo,
    })
  },

  /**
   * 返回按钮
   */
  backAction: function () {
    wx.navigateBack({});
  }


})