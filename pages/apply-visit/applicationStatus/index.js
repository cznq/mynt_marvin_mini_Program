// pages/apply-visit/applicationStatus/index.js
var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    cd: {},
    button_text: '申请访问该企业',
    background_color:'',
    take_card_ways:'',
    company_code:'',
    c_status:'',
    submitApplications_title:'您的申请已提交',    
    submitApplications_hint:'' //审核通过文案
  },
  onLoad: function (options) {
    var _this = this;
    var visit_apply_id = options.visit_apply_id;
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
        console.log(res.data.result);
        if (res.data.sub_code == 0) {
          var take_card_ways = res.data.result.company.take_card_ways;
          var c_status = parseInt(res.data.result.status);
          var company_code = res.data.result.company.company_code;
          console.log("take_card_ways:"+take_card_ways);
          switch (c_status) {
            case 0:
              //处理中
              _this.data.background_color = '#007BFF';
              if (take_card_ways == 1) {
                _this.data.submitApplications_hint = '申请通过后您将会收到一张电子门卡，请打开微信服务通知查看。';
              } else {
                _this.data.submitApplications_hint = '申请通过后，将会发送消息到您的微信，请在服务通知中查看。';
              }
              break;
            case 1:
              //同意但是没有取卡
              _this.data.background_color = '#38C361';
              break;
            case 2:
              //同意并且已取卡
              _this.data.background_color = '#38C361';
              break;
            case 3:
              //已拒绝
              _this.data.background_color = '#F5563A';
              break;
            default:
              //错误状态
              _this.data.background_color = '#000';
          }
          _this.themeColor(_this.data.background_color);
          _this.setData({
            background_color: _this.data.background_color,
            submitApplications_hint: _this.data.submitApplications_hint,
            c_status: c_status
          })
          //请求数据
          companyPage.cd(_this, app, "company", "get_company_info", company_code, function () {
            wx.setNavigationBarTitle({
              title: _this.data.cd.company_short_name
            })
          });

        } else {
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  //机器人端预览
  robotPreview: function () {
    companyPage.robotPreview(this);
  },
  //简介展开功能
  introductionAll: function () {
    companyPage.introductionAll(this);
  },
  //分享
  onShareAppMessage: function (res) {
    var message = companyPage.shareMessage(this);
    return {
      title: message[0],
      path: message[1],
      imageUrl: message[2],
    }
  },
  next: function () {
    wx.reLaunch({
      url: '../reasonsVisiting/index',
    })
  },
  //主题颜色
  themeColor:function(color){
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },
  makePhone:function(){
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.cd.phone
    })
  }
})