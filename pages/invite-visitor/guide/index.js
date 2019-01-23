// pages/invite-visitor/start/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thirdStepInfo: {
      img: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/invitation_step_three%402x.png',
      intro: '取出电梯卡并在电梯刷卡上楼。'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_company_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          company_code: options.company_code
        })
      },
      success: res => {
        if (res.data.result && res.data.result.take_card_ways==1) {
          _this.setData({
            thirdStepInfo: {
              img: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/invitation_step_three_ecard%402x.png',
              intro: '在微信服务通知查看电子门卡，在电梯刷卡上楼。'
            }
          }) 
         
        } 

      },
      fail: res => {
        
      }
    })
  }


})