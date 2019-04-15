
const app = getApp();
Page({

  /**
   * 录入身份信息公共页面
   * 邀请流程，员工快捷取卡，员工信息修改，申请发卡，协议商户
   * Param: 
   *   source (来源) | params (参数)                               | callback（回调）
   *   invite       | form_id                                     | /pages/invite-visitor/receive/index?invitation_id
   *   takeCard     | card_type                                   | /pages/employee/take-card/open/index 或者  /pages/e-card/detail/index
   *   editInfo     |                                             | /pages/employee/homepage/index
   *   applyVisit   |  company_id, form_id, visitor_name, note    | /pages/apply-visit/applicationStatus/index?visit_apply_id
   *   benifit      |  commerce_id                                | /benifit/pages/vip-card/vip-card
   */

  data: {
    isIphoneX: app.globalData.isIphoneX,
    formData: {
      name: null,
      phone: null,
      id_number: null
    },
    formReady: false,
    inputError: {
      name: false,
      phone: false,
      id_number: false
    },
    errorData: null,
    options: {},
    cardType: 0, //0 大陆身份证 1 护照
    hideIdCard: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.data.options.source = options.source;
    this.data.options.params = options.params;
    if (options.idInfo) {
      let idInfo = JSON.parse(options.idInfo)
      this.setData({
        formData: idInfo,
        cardType: idInfo.id_type
      })
      if (idInfo.name && idInfo.id_number) {
        this.setData({ formReady: true })
        this.showError('#ib2', '请确保使用您本人的证件号，我们会将它作为重置您人脸信息的凭证。');
      } else {
        this.showInfo('#ib2', '请确保使用您本人的证件号，我们会将它作为重置您人脸信息的凭证。');
      }
    } else if (options.hideIdCard=='true'){
      this.setData({
        hideIdCard: true
      })
    } else {
      this.showInfo('#ib2', '请确保使用您本人的证件号，我们会将它作为重置您人脸信息的凭证。');
    }
    
  },

  /**
   * 提示框
   */
  showError: function (id, txt) {
    var _this = this;
    const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res);
      _this.setData({
        errorData: {
          top: res[0].bottom + 6,
          text: txt,
          bgcolor: '#fcd7d7',
          txtcolor: 'rgba(245, 113, 113, 1)'
        }
      })
    })
  },

  /**
   * 错误提示
   */
  showInfo: function (id, txt) {
    var _this = this;
    const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      _this.setData({
        errorData: {
          top: res[0].bottom + 6,
          text: txt,
          bgcolor: 'rgba(242, 243, 248, 1)',
          txtcolor: 'rgba(136, 145, 169, 1)'
        }
      })
    })
  },
  //切换证件类型
  changCardType: function (e) {
    this.setData({
      cardType: e.currentTarget.dataset.idtype
    })
  },
  //提交表单
  editSubmit: function (e) {
    var that = this;
    var id_type = that.data.cardType;    
    that.checkParam(that.data.formData.name, that.data.formData.phone, that.data.formData.id_number, function(){
      var idInfo = JSON.stringify({
        name: that.data.formData.name,
        id_type: id_type,
        phone: that.data.formData.phone,
        id_number: that.data.formData.id_number
      })
      wx.navigateTo({
        url: '/pages/collect-info/start/index?source=' + that.data.options.source + '&params=' + that.data.options.params + '&idInfo=' + idInfo
      })
    }) 

  },

  /**
   * 检测表单可提交状态
   */
  checkForm: function (e) {
    this.setData({
      errorData: null,
      inputError: {
        name: false,
        phone: false,
        id_number: false
      }
    })
    if (e.currentTarget.id == 'i0') {
      if (e.detail.value !== '') {
        this.setData({ 'formData.name': e.detail.value });
      } else {
        this.setData({ 'formData.name': null });
      }
    }
    if (e.currentTarget.id == 'i1') {
      if (e.detail.value !== '') {
        this.setData({ 'formData.phone': e.detail.value });
      } else {
        this.setData({ 'formData.phone': null });
      } 
    }
    if (e.currentTarget.id == 'i2') {
      if (e.detail.value !== '') {
        this.setData({ 'formData.id_number': e.detail.value });
      } else {
        this.setData({ 'formData.id_number': null });
      } 
    }
    if (this.data.formData.name && this.data.formData.phone && this.data.formData.id_number && !this.data.hideIdCard) {
      this.setData({ formReady: true })
    }
    if (this.data.formData.name && this.data.formData.phone && this.data.hideIdCard) {
      this.setData({ formReady: true })
    }
  },

  /**
   * 检测提交参数
   */
  checkParam(name, phone, id_number, callback) {
    var that = this
    var name_reg = name == ''?false:true
    var idcard_reg = app.Util.checkID(id_number) || app.Util.checkPassport(id_number);
    var phone_reg = app.Util.checkPhone(phone);

    if (name_reg === false) {
      that.setData({
        'inputError.name': true,
        'inputError.phone': false,
        'inputError.id_number': false
      });
      that.showError('#ib0', '请输入真实的姓名');
    } else if (phone_reg === false) {
      that.setData({
        'inputError.name': false,
        'inputError.phone': true,
        'inputError.id_number': false
      });
      that.showError('#ib1', '请输入正确的手机号');
    } else if (idcard_reg === false && !this.data.hideIdCard) {
      that.setData({
        'inputError.name': false,
        'inputError.phone': false,
        'inputError.id_number': true
      });
      that.showError('#ib2', '请输入有效的证件号');
    } else {
      callback();
    }
  },

  /**
   * 清空输入框
   */
  clearInput: function (e) {
    console.log(e);
    this.setData({
      errorData: null,
      inputError: {
        name: false,
        phone: false,
        id_number: false
      }
    })
    var bid = e.currentTarget.id;
    if (bid == 'b0') {
      this.setData({
        'formData.name': null,
        'inputError.name': null,
        errorData: null
      })
    }
    if (bid == 'b1') {
      this.setData({
        'formData.phone': null,
        'inputError.phone': null,
        errorData: null
      })
    }
    if (bid == 'b2') {
      this.setData({
        'formData.id_number': null,
        'inputError.id_number': null,
        errorData: null
      })
    }
  }

})