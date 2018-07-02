
var app = getApp()
Page({
  data: {
    vedio: false,
    invitation_id: null,
    vip: null,
    time: "00 : 00 : 00",
    animationData: 'frame',
    width: '250px',
    height: '250px',
    iphonex: false
  },
  
  onLoad: function (options) {
    var that = this;
    that.setData({
      invitation_id: options.invitation_id,
      vip: options.vip
    })
    if (wx.createCameraContext()) {
      that.ctx = wx.createCameraContext()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示  
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    
    wx.getSystemInfo({
      success: function (res) {
        if(res.model.indexOf('iPhone X')!= -1) {
          console.log(res.model);
          that.setData({
            iphonex: true,
            width: (res.windowWidth - 40) + 'px',
            height: (res.windowWidth - 40) + 'px'
          })
        } else {
          that.setData({
            width: (res.windowWidth - 60) + 'px',
            height: (res.windowWidth - 60) + 'px'
          })
        }
        
      }
    })
  },
  
  Util: require('../../utils/util.js'),

  setTime: function () {
    var that = this;
    var int;
    var hour, minute, second,hs,ms,ss;
    hour = minute = second = 0;
    int = setInterval(function(){
      if (that.data.vedio) {
        second=second+1;
        if (second >= 60) {
          second = 0;
          minute = minute + 1;
        }
        if (minute >= 60) {
          minute = 0;
          hour = hour + 1;
        }
        if (second < 10) {
          ss = "0"+second;
        } else {
          ss= second;
        }
        if (minute < 10) {
          ms = "0" + minute;
        } else {
          ms = minute;
        }
        if (hour < 10) {
          hs = "0" + hour;
        } else {
          hs = hour;
        }
        var t= hs + " : " + ms + " : " + ss;
        that.setData({
          time: t
        })
      } else {
        clearInterval(int);
      }
    }, 1000);

  },

  startRecord: function () {
    this.ctx.startRecord({
      success: (res) => {
        this.setData({
          vedio: true
        })
        this.setTime();
      }
    })
  },

  stopRecord: function () {
    var that = this;
    that.setData({
      vedio: false
    });
    that.ctx.stopRecord({
      success: (res) => {
        wx.showLoading({ title: '人脸上传中' });
        wx.uploadFile({
          url: app.globalData.BASE_URL + 'wechat/intapp/upload',
          method: 'POST',
          filePath: res.tempVideoPath,
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'video',
          formData: {
            invitation_id: that.data.invitation_id
          },
          success: function (res) {
            wx.hideLoading();
            that.skipVedio();
            that.setData({
              time: "00 : 00 : 00"
            });
          },
          fail: function (r) {
            that.setData({
              time: "00 : 00 : 00"
            });
          }
        })
 
      },
      error(e) {
        console.log(e.detail)
      }
    })
  },

  skipVedio: function () {
    wx.navigateTo({
      url: '/pages/invite-success/invite-success?vip=' + this.data.vip + '&invitation_id=' + this.data.invitation_id,
    })
  },

  onReady: function () {

  }

})