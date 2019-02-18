// pages/apply-visit/reasonsVisiting/index.js
var toast = require('../../../templates/showToast/showToast');
const app = getApp();
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    button_text: '下一步',
    company_id: '',//公司id
    company_code:'',//公司码
    is_force_visitor_input_info: '', //是否需要身份信息，0：否，1：是
    take_card_ways: '', //刷卡方式，0:电子卡,1:实体卡
    disabled: false
  },
  onLoad: function(options) {
    var _this = this;
    _this.data.company_id = options.company_id;
    _this.data.company_code = options.company_code;
    _this.data.is_force_visitor_input_info = options.is_force_visitor_input_info;
    _this.data.take_card_ways = options.take_card_ways;
  },
  editSubmit: function(e) {
    var _this = this;
    var visitor_name = e.detail.value.name;
    var note = e.detail.value.reason;

    if (_this.data.disabled==false){
      _this.setData({
        disabled:true
      })
    }

    setTimeout(function(){
      _this.setData({
        disabled: false
      })
    },2000)

    if (e.detail.value.name !== '') {
       
        console.log('需要身份，跳转到录入人脸流程');

      app.checkHasRecodeFace('visitor', _this.data.company_id, function (res) {

        if (res == '') {
          console.log('还没录入身份信息，跳转到录入人脸流程');
          var params = JSON.stringify({
            visit_company_id: _this.data.company_id,
            visitor_name: e.detail.value.name,
            note: e.detail.value.reason,
            form_id: e.detail.formId,
            card_type: _this.data.take_card_ways
          })
          //不需要输入身份信息
          if (_this.data.is_force_visitor_input_info == 0) {
            wx.navigateTo({
              url: '/pages/collect-info/identity/index?source=applyVisit&params=' + params + '&hideIdCard=true'
            })
          } else {
            wx.navigateTo({
              url: '/pages/collect-info/identity/index?source=applyVisit&params=' + params
            })
          }
          
        } else {
          app.applySubmit(_this.data.company_id, e.detail.formId, e.detail.value.name, e.detail.value.reason, function (visit_apply_id) {
            wx.redirectTo({
              url: '/pages/apply-visit/applicationStatus/index?visit_apply_id=' + visit_apply_id,
            })
          }) 
        }

      }) 

          
      
    } else {
      toast.showToast(this, {
        toastStyle: 'toast pt',
        title: '姓名不能为空哦',
        duration: 2000,
        mask: false,
        cb: function() {
          _this.setData({
            isfocus: true
          })
        }
      });
    }
  }
})