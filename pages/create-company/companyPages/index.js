// pages/create-company/companyPages/index.js
var app = getApp();
var companyPage = require('../../../templates/companyPages/companyPages');
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    //CstateCode: 1,
    cd:{},
    button_text:'确认创建公司',
    isCoverView:true,//视频全屏cover-view隐藏
  },
  onLoad: function (options) {
    var _this = this;
    console.log(wx.getStorageSync('xy_session'));
    app.Util.network.POST({
      url:app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code == 0) {
          console.log('数据成功');
          if (res.data.result.role == 3) {
            _this.data.isrobotReview = true;
          }
        } else {
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    }),
    wx.setNavigationBarTitle({
      title: '创建公司'
    })
    //请求数据
    companyPage.cd(_this, app, "company", "get_info", wx.getStorageSync('xy_session'));
  },
  //机器人端预览
  robotPreview:function(){
    companyPage.robotPreview(this);
  },
  //简介展开功能
  introductionAll:function(){
    companyPage.introductionAll(this);
  },
  //视频全屏cover-view隐藏
  fullScreen: function (e){
    var _this = this;
    if (e.detail.fullScreen){
      _this.setData({
        isCoverView:false
      })
    }else{
      _this.setData({
        isCoverView: true
      })
    }
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
  //确认创建公司
  next:function(){
    wx.reLaunch({
      url: '../../manage/manage',
    })
  }
})