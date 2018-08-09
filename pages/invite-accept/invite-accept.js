var md5 = require('../../utils/md5.js');
var app = getApp()
Page({
  data: {
    xy_session: null,
    vedio: false,
    invitation_id: null,
    vip: null,
    time: "00 : 00 : 00",
    animationData: 'frame',
    width: '0',
    height: '250px',
    iphonex: false,
    invitation: null,
    visitor: null
  },

  onLoad: function (options) {
    var that = this;
    if (options.vip !== "yes") { options.vip = null }
    that.setData({
      invitation_id: options.invitation_id,
      vip: options.vip,
      xy_session: wx.getStorageSync('xy_session')
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
    var invitationId = that.data.invitation_id;
    var unionId = app.globalData.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        union_id: unionId,
        data: JSON.stringify({
          invitation_id: invitationId,
        })
      },
      success: res => {
        that.setData({
          invitation: res.data.result,
        })
        that.getVisitorinfo();
      }
    })
  },

  getVisitorinfo: function () {
    var that = this;
    var unionId = that.data.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_visitor_info',
        union_id: unionId,
        data: JSON.stringify({})
      },
      success: res => {
        console.log(res);
        that.setData({
          visitor: res.data.result
        })
        if (res.data.result.input_pic_url !== "" && res.data.result.input_pic_url !== null) {
          wx.redirectTo({
            url: '/pages/invite-success/invite-success?invitation_id=' + that.data.invitation_id + '&vip=' + that.data.vip,
          })
        }
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
      } else {
        clearInterval(int);
      }
    }, 1000);

  },

  takePhoto: function() {
    var avatar = null;
    for(var i=0;i<5;i++){
      if(avatar == null){
        var that = this;
        that.ctx.takePhoto({
          quality: 'low',
          success: (res) => {
            console.log(res.tempImagePath);
            var service = 'visitor';
            var method = 'upload_face_pic';
            var app_id = '65effd5a42fd1870b2c7c5343640e9a8';
            var timestamp = Math.round(new Date().getTime() / 1000 - 28800);
            var sign_type = 'MD5';
            var stringA = 'app_id=' + app_id + '&data=&method=' + method + '&service=' + service + '&timestamp=' + timestamp;
            var sign = md5.hex_md5(stringA + '&key=a8bfb7a5f749211df4446833414f8f95');
            wx.uploadFile({
              url: app.globalData.BASE_API_URL,
              method: 'POST',
              filePath: res.tempImagePath,
              header: {
                'content-type': 'multipart/form-data'
              },
              name: 'face_pic',
              formData: {
                service: service,
                method: method,
                app_id: app_id,
                timestamp: timestamp,
                sign_type: sign_type,
                sign: sign,
                union_id: app.globalData.xy_session,
                data: ''
              },
              success: function (res) {
                var data = JSON.parse(res.data);
                console.log(data);
                if (data.sub_code == 0){
                  avatar = res.data.url;
                  wx.showLoading({ title: '人脸上传中' });
                  that.stopRecord();
                }
              },
              fail: function (r) {
              }
            })
          },
          fail: function() {
          }
        })
      }
    }
    
  },

  startRecord: function () {
    if (this.data.visitor.input_pic_url !== "") {
      wx.showModal({
        content: '您已经录过人脸信息',
        showCancel: false
      })
    } else {
      this.setData({
        vedio: true
      })
      this.setTime();
      this.takePhoto();
    }
  },

  stopRecord: function () {
    var that = this;
    that.setData({
      vedio: false
    });
    that.skipVedio();
  },

  skipVedio: function () {
    wx.hideLoading();
    wx.navigateTo({
      url: '/pages/invite-success/invite-success?vip=' + this.data.vip + '&invitation_id=' + this.data.invitation_id,
    })
  },

  goEditinfo: function () {
    wx.navigateTo({
      url: '/pages/edit-info/edit-info?vip=' + this.data.vip + '&invitation_id=' + this.data.invitation_id,
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