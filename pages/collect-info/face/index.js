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
    timer: 0,
    status: 'start', // start, stop, uploading
    cameraErrorText: "",
    isCameraAuth:true,
    progress: 0,
    face_verify_code: []
  },

  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.data.options.source = options.source;
    that.data.options.params = JSON.parse(options.params);
    that.data.options.idInfo = JSON.parse(options.idInfo);
    that.data.options.faceConfig = JSON.parse(options.faceConfig);

    that.setData({ face_verify_code: that.data.options.faceConfig.face_verify_code.split('') })
    if (app.Util.checkcanIUse('camera')) {
      app.myLog('相机检测', '相机组件检测通过');
      that.setData({
        ctx: wx.createCameraContext()
      })
    }
    app.Util.checkcanIUse('cover-view');
  },

  cameraError: function () {
    var that = this;
    app.myLog('取消打开摄像头授权', '你已经取消了人脸录入的授权');
    this.setData({
      cameraErrorText: "\n\n你已经取消了人脸录入的授权,\n点击开始拍摄按钮重新授权"
    });
    that.data.isCameraAuth = false;
  },

  openCameraAuth: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.camera'] == false) {
          wx.showModal({
            title: '是否授权录入人脸',
            content: '录入人脸需要打开摄像头，点击确定打开摄像头',
            success: function (tip) {
              if (tip.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.camera"] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.setData({
                        cameraErrorText: "已经授权，请关闭小程序重新打开"
                      });
                      that.data.isCameraAuth=true;
                      wx.navigateBack();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                      that.data.isCameraAuth = false;
                    }
                  }
                })
              }
            }
          })
        }else{
          if (res.authSetting['scope.camera'] !== undefined){
            that.data.isCameraAuth = true;
          }
        }
      }
    })
  },

  /**
   * 开始录入
   */
  startRecodeFace: function () {
    var that = this;
    var int;
    that.openCameraAuth(); console.log(that.data.options.faceConfig);
    if (that.data.isCameraAuth==true){
      int = setInterval(function () {
        that.setData({ 
          timer: that.data.timer + 1,
          progress: (100/that.data.options.faceConfig.counter)*that.data.timer
        })
        if (that.data.timer >= that.data.options.faceConfig.counter) {
          clearInterval(int);
          that.stopRecord(that, that.data.ctx, int);
        }
      }, 1000);
      that.startRecord(that, that.data.ctx, int);
    }
  },

  /**
   * 开始录像
   */
  startRecord(self, ctx, timer){
    self.setData({ status: 'stop' })
    ctx.startRecord({
      success: (res) => {
        console.log('startRecord')
      }
    })
  },
  /**
   * 结束录像
   */
  stopRecord(self, ctx, timer){
    self.setData({ recodeFace: 'start' })
    ctx.stopRecord({
      success: (res) => {
        console.log(res);
        self.finishSubmit(self, timer, res.tempVideoPath)
      },
      fail: function () {
        console.log('stop recode fail')
      }
    })
  },

  finishSubmit(that, timer, tempFilePath) {
    console.log(that.data.options.source);
    if (that.data.options.source == 'invite') {
      var op_type = 0, user_type = 0;
      that.uploadFaceVideo(that, timer, tempFilePath, that.data.options.params.company_id, op_type, user_type, function () {
        app.receiveSubmit(that.data.options.params.invitation_id, that.data.options.params.form_id, function () {
          wx.hideLoading();
          wx.reLaunch({
            url: '/pages/invite-visitor/receive/index?invitation_id=' + that.data.options.params.invitation_id,
          })
        })
      });

    } else if (that.data.options.source == 'applyVisit') {
      var op_type = 0, user_type = 0;
      that.uploadFaceVideo(that, timer, tempFilePath, that.data.options.params.visit_company_id, op_type, user_type, function () {
        app.applySubmit(that.data.options.params.visit_company_id, that.data.options.params.form_id, that.data.options.params.visitor_name, that.data.options.params.note, function (visit_apply_id) {
          wx.hideLoading();
          wx.reLaunch({
            url: '/pages/apply-visit/applicationStatus/index?visit_apply_id=' + visit_apply_id,
          })
        })
      });

    } else if (that.data.options.source == 'takeCard') {
      var op_type = 0, user_type = 2;
      that.uploadFaceVideo(that, timer, tempFilePath, that.data.options.params.company_id, op_type, user_type, function () {
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
      var op_type = 0, user_type = 2;
      that.uploadFaceVideo(that, timer, tempFilePath, that.data.options.params.company_id, op_type, user_type, function () {
        wx.hideLoading();
        wx.reLaunch({
          url: '/pages/employee/homepage/index',
        })
      });

    } else if (that.data.options.source == 'reRecodeFace') {
      var op_type = 1, user_type = 2;
      that.uploadFaceVideo(that, timer, tempFilePath, that.data.options.params.company_id, op_type, user_type, function () {
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
  uploadFaceVideo(self, timer, tempVideoPath, company_id, op_type, user_type, callback = function () { }) {
    var data = JSON.stringify({
      union_id: wx.getStorageSync('xy_session'),
      company_id: company_id,
      face_verify_code: self.data.options.faceConfig.face_verify_code,
      op_type: op_type,
      user_type: user_type,
      user_name: self.data.options.idInfo.name,
      phone: self.data.options.idInfo.phone,
      id_type: self.data.options.idInfo.id_type,
      id_number: self.data.options.idInfo.id_number
    });
    var service = 'face';
    var method = 'upload_face_video';
    var app_id = '65effd5a42fd1870b2c7c5343640e9a8';
    var timestamp = Math.round(new Date().getTime() / 1000 - 28800);
    var sign_type = 'MD5';
    var stringA = 'app_id=' + app_id + '&data=' + data + '&method=' + method + '&service=' + service + '&timestamp=' + timestamp;
    var sign = md5.hex_md5(stringA + '&key=a8bfb7a5f749211df4446833414f8f95');
    wx.showLoading({ title: '人脸上传中' });
    var uploadTask = wx.uploadFile({
      url: 'http://61.149.7.239:10001/mini_program/api/',        //app.globalData.BASE_API_URL,
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
      success: function (res) {
        console.log(res);
        var data = JSON.parse(res.data);
        if (data.sub_code == 0) {
          clearInterval(timer);
          callback();
        } else if(data.result) {
          self.uploadFaceError(data.sub_code, data.result.error);
          app.myLog("人脸上传失败", data.result.error);
        } else {
          self.uploadFaceError(data.sub_code, data.sub_msg);
          app.myLog("人脸上传失败", data.sub_msg);
        }
      },
      fail: function () {
        self.uploadFaceError(0, '请将正脸置于框内，用普通话说出4位验证数字。');
        app.myLog("微信上传文件失败", "上传人脸失败");
      }
    })
    uploadTask.onProgressUpdate((res) => {
      console.log(res);
      self.setData({ status: 'uploading'})
      if(res.progress == 100){
        wx.hideLoading();
      }
    })
  },

  uploadFaceError(errCode, errMsg){
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

  onShow: function () {
    this.openCameraAuth();
  },

  /**
   * 返回按钮
   */
  backAction: function () {
    wx.navigateBack({});
  }

})