var md5 = require('../../../utils/md5.js');
var toast = require('../../../templates/showToast/showToast');
var app = getApp()
Page({

  /**
   * 录入人脸信息公共页面
   * 邀请流程，员工快捷取卡，员工信息录入, 员工人脸修改，申请发卡，协议商户
   * Param:
   *   source (来源) | params (参数)                               | callback（回调）
   *   invite       | form_id                                     | /pages/invite-visitor/receive/index?invitation_id
   *   takeCard     | card_type                                   | /pages/employee/take-card/open/index 或者  /pages/e-card/detail/index
   *   editInfo     | company_id                                  | /pages/employee/homepage/index
   *   reRecodeFace | company_id                                  | /pages/employee/homepage/index
   *   applyVisit   | company_id, form_id, visitor_name, note     | /pages/apply-visit/applicationStatus/index?visit_apply_id
   *   benifit      | commerce_id                                 | /benifit/pages/vip-card/vip-card
   */

  data: {
    isIphoneX: app.globalData.isIphoneX,
    options: {},
    ctx: {},
    status: 'start', // start, stop, uploading
    cameraErrorText: "",
    isCameraAuth: true,
    progress: 100,
    face_verify_code: [],
    tempThumbPath: '',
    buttonDisabled: true,
    progressAni: ''
  },

  onLoad: function(options) {
    this.loadConfig(this);
    this.data.options.source = options.source;
    this.data.options.params = JSON.parse(options.params);
    this.data.options.idInfo = JSON.parse(options.idInfo);

    if (app.Util.checkcanIUse('camera')) {
      app.myLog('相机检测', '相机组件检测通过');
      this.setData({
        ctx: wx.createCameraContext()
      })
    }
    app.Util.checkcanIUse('cover-view');
  },

  cameraError: function() {
    var that = this;
    app.myLog('取消打开摄像头授权', '你已经取消了人脸录入的授权');
    this.setData({
      cameraErrorText: "\n\n你已经取消了人脸录入的授权,\n点击开始拍摄按钮重新授权"
    });
    that.data.isCameraAuth = false;
  },

  checkAuth(_this, callback = function() {}) {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          callback()
        } else if (res.authSetting['scope.record'] === false) {
          wx.openSetting({
            success: function(data) {
              if (data.authSetting["scope.record"] === true) {
                wx.navigateBack()
              }
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.record',
            success() {
              callback()
            }
          })
        }
      }
    })
  },

  /**
   * 开始录入
   */
  startRecordFace: function() {
    var that = this
    that.checkAuth(that, function() {
      that.startRecord(that, that.data.ctx)
    })
  },

  /**
   * 开始录像
   */
  startRecord(self, ctx) {
    var int;
    ctx.startRecord({
      success: (res) => {
        self.setData({
          status: 'stop'
        }, function() {
          self.createProgressAni()
        })
        setTimeout(function() {
          self.stopRecord(self, self.data.ctx);
        }, parseInt(self.data.faceConfig.counter) * 1000)
      },
      fail: function(res) {
        app.myLog("开始录像出错", res.errMsg);
        wx.showToast({
          title: '微信录入视频出错',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  /**
   * 结束录像
   */
  stopRecord(self, ctx) {
    ctx.stopRecord({
      success: (res) => {
        ctx.takePhoto({
          quality: 'high',
          success: (res) => {
            self.setData({
              tempThumbPath: res.tempImagePath
            })
          }
        })
        self.finishSubmit(self, res.tempVideoPath)
      },
      fail: function(res) {
        app.myLog("结束录像出错", res.errMsg);
        wx.showToast({
          title: '微信结束录入视频出错',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  finishSubmit(that, tempFilePath) {
    if (that.data.options.source == 'invite') {
      that.uploadFaceVideo(that, tempFilePath, that.data.options.params.company_id, 0, function() {
        app.receiveSubmit(that.data.options.params.invitation_id, that.data.options.params.form_id, function() {
          wx.hideLoading();
          wx.reLaunch({
            url: '/pages/invite-visitor/receive/index?invitation_id=' + that.data.options.params.invitation_id,
          })
        })
      });
    } else if (that.data.options.source == 'applyVisit') {
      that.uploadFaceVideo(that, tempFilePath, that.data.options.params.visit_company_id, 0, function() {
        app.applySubmit(that.data.options.params.visit_company_id, that.data.options.params.form_id, that.data.options.params.visitor_name, that.data.options.params.note, function(visit_apply_id) {
          wx.hideLoading();
          wx.reLaunch({
            url: '/pages/apply-visit/applicationStatus/index?visit_apply_id=' + visit_apply_id,
          })
        })
      });
    } else if (that.data.options.source == 'takeCard') {
      that.uploadFaceVideo(that, tempFilePath, that.data.options.params.company_id, 2, function() {
        wx.hideLoading();
        if (that.data.options.params.card_type == 0) {
          wx.reLaunch({
            url: '/pages/employee/take-card/open/index?company_id=' + that.data.options.params.company_id,
          })
        } else {
          wx.reLaunch({
            url: '/pages/e-card/detail/index'
          })
        }
      });
    } else if (that.data.options.source == 'editInfo') {
      that.uploadFaceVideo(that, tempFilePath, that.data.options.params.company_id, 2, function() {
        wx.hideLoading();
        wx.reLaunch({
          url: '/pages/employee/homepage/index',
        })
      });
    } else if (that.data.options.source == 'reRecodeFace') {
      that.uploadFaceVideo(that, tempFilePath, that.data.options.params.company_id, 2, function() {
        wx.hideLoading();
        wx.reLaunch({
          url: '/pages/employee/homepage/index',
        })
      });
    }
  },

  /**
   * 上传人脸视频
   */
  uploadFaceVideo(self, tempVideoPath, company_id, user_type, callback = function() {}) {
    var data = JSON.stringify({
      union_id: wx.getStorageSync('xy_session'),
      company_id: company_id,
      user_name: self.data.options.idInfo.name,
      phone: self.data.options.idInfo.phone,
      id_type: self.data.options.idInfo.id_type,
      id_number: self.data.options.idInfo.id_number
    });
    var service = 'face';
    var method = 'verify';
    var app_id = '65effd5a42fd1870b2c7c5343640e9a8';
    var timestamp = Math.round(new Date().getTime() / 1000 - 28800);
    var sign_type = 'MD5';
    var stringA = 'app_id=' + app_id + '&data=' + data + '&method=' + method + '&service=' + service + '&timestamp=' + timestamp;
    var sign = md5.hex_md5(stringA + '&key=a8bfb7a5f749211df4446833414f8f95');
    wx.showLoading({
      title: '身份核验中',
      mask: true
    });
    var uploadTask = wx.uploadFile({
      url: app.globalData.BASE_API_URL,
      method: 'POST',
      filePath: tempVideoPath,
      header: {
        'content-type': 'multipart/form-data'
      },
      name: 'face_video',
      formData: {
        service: service,
        method: method,
        app_id: app_id,
        timestamp: timestamp,
        sign_type: sign_type,
        sign: sign,
        data: data
      },
      success: function(res) {
        var data = JSON.parse(res.data);
        if (data.sub_code == 0) {
          self.updateFace(self, user_type, callback)
        } else if (data.result) {
          self.uploadFaceError(data.sub_code, data.result.error);
          app.myLog("身份核验失败", data.result.error);
        } else {
          self.uploadFaceError(data.sub_code, data.sub_msg);
          app.myLog("身份核验失败", data.sub_msg);
        }
      },
      fail: function() {
        self.uploadFaceError(0, '请将正脸置于框内，用普通话说出4位验证数字。');
        app.myLog("身份核验失败", "身份核验失败");
      }
    })
    uploadTask.onProgressUpdate((res) => {
      self.setData({
        status: 'uploading'
      })
    })
  },

  updateFace(self, user_type, callback = function() {}) {
    wx.showLoading({
      title: '人脸创建中'
    });
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'face',
        method: 'update',
        data: JSON.stringify({
          user_type: user_type
        })
      },
      showLoading: false,
      success: res => {
        if (res.data.sub_code == 0) {
          callback()
        } else if (res.data.result) {
          self.uploadFaceError(res.data.sub_code, res.data.result.error);
          app.myLog("人脸创建失败", res.data.result.error);
        } else {
          self.uploadFaceError(res.data.sub_code, res.data.sub_msg);
          app.myLog("人脸创建失败", res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
        self.uploadFaceError(0, '请将正脸置于框内，用普通话说出4位验证数字。');
      },
      complete: res => {}
    })
  },

  uploadFaceError(errCode, errMsg) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      error: true,
      errorCode: errCode,
      errorMsg: errMsg
    });
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 请求验证数字
   */
  loadConfig(_this) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'face',
        method: 'load_face_config',
        data: JSON.stringify({})
      },
      success: res => {
        if (res.data.result) {
          _this.setData({
            faceConfig: res.data.result,
            face_verify_code: res.data.result.face_verify_code.split(''),
            buttonDisabled: false
          })
        }
      },
      fail: res => {
        console.log('fail');
      },
      complete: res => {}
    })
  },

  createProgressAni: function() {
    let self = this
    let animation = wx.createAnimation({
      duration: parseInt(self.data.faceConfig.counter) * 1000,
      timingFunction: 'linear',
      success: function(res) {
        console.log(res)
      }
    })
    // let windowWidth = wx.getStorageSync('sysinfo').windowWidth;
    wx.getStorage({
      key: 'sysinfo',
      success(res) {
        console.log(res.data.windowWidth)
        animation.translateX(-res.data.windowWidth).step()
        self.setData({
          progressAni: animation.export()
        })
      }
    })
    // animation.translateX(-windowWidth).step()

  }

})