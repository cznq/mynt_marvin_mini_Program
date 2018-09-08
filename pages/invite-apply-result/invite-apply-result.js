// pages/invite-apply-notice/invite-apply-notice.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_status: null,
    visit_apply_id: null,
    applyInfo: null,
    showVideo: false,
    error: "",
    screenWidth: 0,
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      visit_apply_id: options.visit_apply_id
    });
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth
        });
      }
    });

  },

  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;   
    var viewWidth = 500,           
      viewHeight = 500 / ratio;    
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },


  getApplyStatus: function (status, company_short_name) {
    var that = this;
    switch (status) {
      case "0":
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#4d65f5',
          animation: {
            duration: 100,
            timingFunc: 'linear'
          }
        })
        that.setData({
          apply_status: {
            status: "submited",
            status_icon: "../../images/status_submited.png",
            status_title: "您的申请已提交",
            status_info: "已向" + company_short_name + "提交申请，申请通过后即可前往机器人处取卡",
            step: {
              first: "",
              second: ""
            }
          }
        })
        break;
      case "1":
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#38c560',
          animation: {
            duration: 100,
            timingFunc: 'linear'
          }
        })
        that.setData({
          apply_status: {
            status: "passed",
            status_icon: "../../images/status_passed.png",
            status_title: "申请已通过，请前往取卡",
            status_info: "公司已通过您的申请，请前往机器人处取卡",
            step: {
              first: "on",
              second: ""
            }
          }
        })
        break;
      case "2":
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#4d65f5',
          animation: {
            duration: 100,
            timingFunc: 'linear'
          }
        })
        that.setData({
          apply_status: {
            status: "succeed",
            status_icon: "../../images/status_succeed.png",
            status_title: "已成功取卡",
            status_info: "已成功取卡，期待下次光临！",
            step: {
              first: "on",
              second: "on"
            }
          }
        })
        break;
      case "3":
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#f5563a',
          animation: {
            duration: 100,
            timingFunc: 'linear'
          }
        })
        that.setData({
          apply_status: {
            status: "refused",
            status_icon: "../../images/status_refused.png",
            status_title: "公司拒绝了您的申请",
            status_info: "欢迎下次光临！",
            step: null
          }
        })
        break;
      default:
        
    }
  },

  getApplyInfo: function () {
    var that = this;
    if (that.data.visit_apply_id == undefined) {
      that.setData({
        error: "没有获取到邀请信息"
      })
    }
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_visit_apply_info',
        union_id: unionId,
        data: JSON.stringify({
          visit_apply_id: that.data.visit_apply_id,
        })
      },
      success: res => {
        console.log(res.data.result);
        that.getApplyStatus(res.data.result.status, res.data.result.company.company_short_name);
        if (res.data.result.company.video_url !== "") {
          that.setData({
            showVideo: true
          })
        }
        that.setData({
          applyInfo: res.data.result
        })
      },
      fail: res => {
        
      }
    })
  },

  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.id
    })
  },

  identifyQrcode() {
    wx.previewImage({
      current: '', 
      urls: [
        app.globalData.WEB_VIEW_URL + '/img/wechat/qrcode.png'
      ]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('cmpVideo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getApplyInfo();
      })
    } else {
      that.getApplyInfo();
    }
  }

})