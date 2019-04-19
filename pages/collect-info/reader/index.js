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
    faceConfig: {},
    face_verify_code: [],
    buttonDisabled: true,
    error: false,
    errorCode: 0,
    errorMsg: '请将正脸置于框内，用普通话说出4位验证数字。'
  },

  onLoad: function (options) {
    this.loadConfig(this);
    this.data.options.source = options.source;
    this.data.options.params = options.params;
    this.data.options.idInfo = options.idInfo;
    
  },

  onShow: function() {
    if (this.data.error) {
      toast.showToast(this, {
        toastStyle: 'toast4',
        title: '验证失败',
        introduce: this.data.errorMsg,
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
      delta: 3
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
          _this.loadConfig(_this);
        }
      }
    });
  },

  /**
   * 请求验证数字
   */
  loadConfig: function(_this) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'face',
        method: 'load_face_config',
        data: JSON.stringify({})
      },
      success: res => {
        if(res.data.result) {
          _this.setData({
            faceConfig: res.data.result,
            face_verify_code: res.data.result.face_verify_code.split(''),
            buttonDisabled: false
          })
        }
      },
      fail: res => {
        console.log('fail');
      },
      complete: res => {
        
      }
    })
  },

  /**
   * 记住了，开始拍摄
   */
  startRecodeFace: function () {
    wx.navigateTo({
      url: '../face/index?source=' + this.data.options.source + '&params=' + this.data.options.params + '&idInfo=' + this.data.options.idInfo + '&faceConfig=' + JSON.stringify(this.data.faceConfig)
    })
  }

})