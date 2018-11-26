// pages/apply-visit/reasonsVisiting/index.js
var toast = require('../../../templates/showToast/showToast');
const app = getApp();
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    button_text: '下一步',
    company_id:'',
    is_force_visitor_input_info: '',//是否需要身份信息，0：否，1：是
    take_card_ways: ''//刷卡方式，0:电子卡,1:实体卡
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.data.company_id = options.company_id;
    _this.data.is_force_visitor_input_info = options.is_force_visitor_input_info;
    _this.data.take_card_ways = options.take_card_ways;
  },
  editSubmit:function(e){
    var _this = this;
    console.log(_this.data.is_force_visitor_input_info);
    console.log(_this.data.take_card_ways);

    if (is_force_visitor_input_info==0){
      //不需要身份直接跳转
      //0:电子卡,1:实体卡 需要用参数传过去
      //take_card_ways 
    }else{
      //需要身份，跳转到录入人脸流程
    }


    var _this = this;
    if (e.detail.value.name !== ''){
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'visitor',
          method: 'visit_apply',
          data: JSON.stringify({
            union_id: wx.getStorageSync('xy_session'),
            visit_company_id: _this.data.company_id,
            visitor_name: e.detail.value.name,
            note: e.detail.value.reason
          })
        },
        success: res => {
          console.log(res);
          if (res.data.sub_code == 0) {
            console.log('数据成功');
          } else {
            console.log(res.data.sub_msg);
          }
        },
        fail: res => {
          console.log('fail');
        }
      })
      // console.log(_this.data.company_id);
      // console.log(e.detail.value.name);
      // console.log(e.detail.value.reason);
    }else{
      toast.showToast(this, {
        toastStyle: 'toast',
        title: '姓名不能为空哦',
        duration: 2000,
        mask: false,
        cb: function () {
          _this.setData({
            isfocus: true
          })
        }
      });
    }
    
    
  }


})