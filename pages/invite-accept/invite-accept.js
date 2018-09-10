var md5 = require('../../utils/md5.js');
var app = getApp()
Page({
  data: {
    xy_session: null,
    invitation_id: null,
    visit_apply_id: null,
    company_id: null,
    vip: null,
    width: '0',
    height: '250px',
    iphonex: false,
    face: true,
    showButton: true
  },

  onLoad: function (options) {
    var that = this;
    console.log(options);
    if (options.vip !== "yes") { options.vip = null }
    that.setData({
      vip: options.vip,
      company_id: options.company_id,
      invitation_id: options.invitation_id,
      visit_apply_id: options.visit_apply_id
    });
    if (wx.createCameraContext()) {
      that.ctx = wx.createCameraContext()
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        if (res.windowWidth !== 0) {
          if (res.model.indexOf('iPhone X') != -1) {
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
        if (res.data.result) {
          if (res.data.result.input_pic_url !== "" && res.data.result.input_pic_url !== null) {
            that.finishRecordFace();
          }
        }
      }
    })
  },

  getEmployeeinfo: function () {
    var that = this;
    var unionId = that.data.xy_session;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        union_id: unionId,
        data: JSON.stringify({

        })
      },
      success: res => {
        if (res.data.result) {
          if (res.data.result.input_pic_url !== "" && res.data.result.input_pic_url !== null) {
            that.finishRecordFace();
          }
        }
      }
    })
  },

  startRecodeFace: function () {
    var that = this;
    var int;
    that.setData({
      showButton: false
    })
    int = setInterval(function () {
      if(that.data.face == true){
        that.takePhoto();
      }
    }, 1000);
  },

  takePhoto: function() {
    console.log("start face !!!");
    this.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        console.log(res);
        this.setData({
          face: false
        })
        this.getCanvasImg(res.tempImagePath);
      },
      fail: function() {
        console.log("fail take Photo");
      }
    })
    console.log("stops face");
  },

  //上传图片
  uploadCanvasImg: function (canvasImg) {
    var that = this;
    var service = 'visitor';
    var data = JSON.stringify({
      company_id: that.data.company_id
    });
    var method = 'upload_face_pic';
    var app_id = '65effd5a42fd1870b2c7c5343640e9a8';
    var timestamp = Math.round(new Date().getTime() / 1000 - 28800);
    var sign_type = 'MD5';
    var stringA = 'app_id=' + app_id + '&data=' + data + '&method=' + method + '&service=' + service + '&timestamp=' + timestamp;
    var sign = md5.hex_md5(stringA + '&key=a8bfb7a5f749211df4446833414f8f95');
    wx.uploadFile({
      url: app.globalData.BASE_API_URL,
      method: 'POST',
      filePath: canvasImg,
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
        union_id: that.data.xy_session,
        data: data
      },
      success: function (res) {
        console.log(res.data);
        var data = JSON.parse(res.data);
        if (data.sub_code == 0) {
          wx.showLoading({ title: '人脸上传中' });
          that.finishRecordFace();
        } else {
          that.setData({
            face: true
          })
        }
      },
      fail: function (r) {
      }
    })
  },

  //压缩并获取图片
  getCanvasImg: function (tempFilePath) {
    var that = this;
    const ctxv = wx.createCanvasContext('attendCanvasId');
    ctxv.drawImage(tempFilePath, 0, 0, 300, 300);
    ctxv.draw(true, function () {
      wx.canvasToTempFilePath({
        destWidth: 300,
        destHeight: 300,
        canvasId: 'attendCanvasId',
        success: function success(res) {
          that.uploadCanvasImg(res.tempFilePath);
        }, fail: function (e) {
          that.getCanvasImg(tempFilePath);
        }
      });
    });
  },

  finishRecordFace: function () {
    var that = this;
    wx.hideLoading();
    if (app.Util.checkNumber(that.data.invitation_id)) {
      wx.navigateTo({
        url: '/pages/invite-success/invite-success?vip=' + that.data.vip + '&invitation_id=' + that.data.invitation_id + '&company_id=' + that.data.company_id,
      })
    } else if (app.Util.checkNumber(that.data.visit_apply_id)) {
      wx.navigateTo({
        url: '/pages/invite-apply-result/invite-apply-result?visit_apply_id=' + that.data.visit_apply_id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/take-card-success/take-card-success?company_id=' + that.data.company_id,
      })
    }
  },

  onShow: function () {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.setData({
          xy_session: wx.getStorageSync('xy_session')
        })
        if (that.data.invitation_id !== null && that.data.invitation_id !== undefined && that.data.invitation_id !== "undefined") {
          that.getVisitorinfo();
        } else {
          that.getEmployeeinfo();
        }
      })
    } else {
      that.setData({
        xy_session: wx.getStorageSync('xy_session')
      })
      if (that.data.invitation_id !== null && that.data.invitation_id !== undefined && that.data.invitation_id !== "undefined") {
        that.getVisitorinfo();
      } else {
        that.getEmployeeinfo();
      }
    }
    
  },

  onReady: function() {
    
  }

})