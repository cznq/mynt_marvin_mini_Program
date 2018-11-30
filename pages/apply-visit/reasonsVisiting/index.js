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
    take_card_ways: '' //刷卡方式，0:电子卡,1:实体卡
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
    var note=e.detail.value.reason;

    if (e.detail.value.name !== '') {
      //不需要身份直接跳转
      if (_this.data.is_force_visitor_input_info == 0) {
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'visitor',
            method: 'visit_apply',
            data: JSON.stringify({
              union_id: wx.getStorageSync('xy_session'),
              visit_company_id: _this.data.company_id,
              visitor_name: e.detail.value.name,
              note: e.detail.value.reason,
              form_id: e.detail.formId
            })
          },
          success: res => {
            console.log(res);
            if (res.data.sub_code == 0) {
              var visit_apply_id = res.data.result.visit_apply_id;
              app.Util.network.POST({
                url: app.globalData.BASE_API_URL,
                params: {
                  service: 'visitor',
                  method: 'get_visit_apply_info',
                  data: JSON.stringify({
                    visit_apply_id: visit_apply_id
                  })
                },
                success: res => {
                  if (res.data.sub_code == 0) {
                    if (_this.data.take_card_ways == 0 && res.data.result.status == 1 || res.data.result.status == 2) {
                      //电子卡审核通过状态
                      wx.navigateTo({
                        url: '/pages/e-card/detail/index',
                      })
                    } else {
                      wx.navigateTo({
                        url: '/pages/apply-visit/applicationStatus/index?visit_apply_id=' + visit_apply_id,
                      })
                    }
                  } else {
                    console.log(res.data.sub_msg);
                  }
                },
                fail: res => {
                  console.log('fail');
                }
              })
            } else {
              console.log(res.data.sub_msg);
              toast.showToast(this, {
                toastStyle: 'toast',
                title: res.data.sub_msg,
                duration: 2000,
                mask: false,
                cb: function () {
                  _this.setData({
                    isfocus: true
                  })
                }
              });
            }
          },
          fail: res => {
            console.log('fail');
          }
        })
      } else {
        console.log('需要身份，跳转到录入人脸流程');
        // wx.navigateTo({
        //   url: '/pages/collect-info/identity/index?visitor_name=' + visitor_name + '&note=' + note,
        // })
      }
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