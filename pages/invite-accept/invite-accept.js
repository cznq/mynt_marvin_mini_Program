
var app = getApp()
Page({
  data: {
    vedio: false,
    invitation_id: null,
    vip: null,
    time: "00 : 00 : 00",
    animationData: 'frame',
    width: '0',
    height: '250px',
    iphonex: false,
    invitation: null
  },

  onLoad: function (options) {
    var that = this;
    if (options.vip !== "yes") { options.vip = null }
    that.setData({
      invitation_id: options.invitation_id,
      vip: options.vip
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        if (res.windowWidth !== 0) {
          if (res.model.indexOf('iPhone X') != -1) {
            console.log(res.model);
            that.setData({
              iphonex: true,
              width: (res.windowWidth - 40) + 'px',
              height: (res.windowWidth - 40) + 'px'
            })
          } else {
            that.setData({
              width: (res.windowWidth - 40) + 'px',
              height: (res.windowWidth - 40) + 'px'
            })
          }
        } else {
          that.setData({
            width: '250px'
          })
        }

      },
      fail: function () {
        that.setData({
          width: '250px'
        })
      }
    })
  },

  getInitation: function () {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_URL + "wechat/intapp/invitation",
      params: {
        xy_session: app.globalData.xy_session,
        invitation_id: that.data.invitation_id
      },
      success: res => {
        that.setData({
          invitation: res.data,
        })
      }
    })
  },

  setTime: function () {
    var that = this;
    var int;
    var hour, minute, second, hs, ms, ss;
    hour = minute = second = 0;
    int = setInterval(function () {
      if (that.data.vedio) {
        second = second + 1;
        if (second >= 60) {
          second = 0;
          minute = minute + 1;
        }
        if (minute >= 60) {
          minute = 0;
          hour = hour + 1;
        }
        if (second < 10) {
          ss = "0" + second;
        } else {
          ss = second;
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
        var t = hs + " : " + ms + " : " + ss;
        that.setData({
          time: t
        })
        that.takePhoto();
      } else {
        clearInterval(int);
      }
    }, 1000);

  },

  takePhoto: function() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res.tempImagePath);
        wx.uploadFile({
          url: app.globalData.BASE_API_URL,
          method: 'POST',
          filePath: res.tempImagePath,
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'face_pic',
          formData: {
            service: 'visitor',
            method: 'upload_face_pic',
            visitor_id: that.data.visitor_id
          },
          success: function (res) {
            
          },
          fail: function (r) {
            
          }
        })
      },
      fail: function() {

      }
    })
  },

  startRecord: function () {
    if (this.data.invitation) {
      wx.showModal({
        content: '您已经录过人脸信息',
        showCancel: false
      })
    } else {
      this.ctx.startRecord({
        success: (res) => {
          this.setData({
            vedio: true
          })
          this.setTime();
        }
      })
    }
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
            console.log(JSON.parse(res.data));
            var res = JSON.parse(res.data);
            that.setData({
              time: "00 : 00 : 00"
            });
            wx.hideLoading();
            if(res.err){
              wx.showModal({
                content: "请对准人脸，重新上传",
                showCancel: false
              })
            }else if(res.msg){
              that.skipVedio();
            }
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

  goEditinfo: function () {
    wx.navigateTo({
      url: '/pages/edit-info/edit-info?visitor_id=' + this.data.invitation.visitor_id + '&vip=' + this.data.vip + '&invitation_id=' + this.data.invitation_id,
    })
  },

  onReady: function () {

  },

  onShow: function () {
    var that = this;
    that.getInitation();
    if (wx.createCameraContext()) {
      that.ctx = wx.createCameraContext()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示  
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    
  }

})