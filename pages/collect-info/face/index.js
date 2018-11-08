var md5 = require('../../../utils/md5.js');
var app = getApp()
Page({

  /**
   * 录入人脸信息公共页面
   * 邀请流程，申请发卡流程，员工快捷取卡
   * Param: 
   * invitation_id   邀请id
   * vip   是否VIP邀请
   * company_id   公司id
   */

  data: {
    invitation_id: null,
    visit_apply_id: null,
    company_id: null,
    vip: null,
    face: true,
    showButton: true,
    cameraErrorText: ""
  },

  onLoad: function (options) {
    var that = this;
    if (options.vip !== "yes") { options.vip = null }
    that.setData({
      vip: options.vip,
      company_id: options.company_id,
      invitation_id: options.invitation_id,
      visit_apply_id: options.visit_apply_id
    });
    if (app.Util.checkcanIUse('camera')) {
      that.ctx = wx.createCameraContext();
      that.openCameraAuth();
    }
    app.Util.checkcanIUse('cover-view');
  },

  cameraError: function () {
    this.setData({
      cameraErrorText: "你已经取消了人脸录入的授权"
    });
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
                      wx.redirectTo({
                        url: '/pages/collect-info/face/index?invitation_id=' + that.data.invitation_id + '&visit_apply_id=' + that.data.visit_apply_id + '&company_id=' + that.data.company_id + '&vip=' + that.data.vip,
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  getVisitorInfo: function () {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_visitor_info',
        data: JSON.stringify({
          union_id: unionId
        })
      },
      success: res => {
        if (res.data.result) {
          if (!app.Util.checkEmpty(res.data.result.input_pic_url)) {
            that.finishRecordFace();
          }
        }
      }
    })
  },

  /**
   * 获取员工信息页面
   */
  getEmployeeInfo: function () {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: unionId
        })
      },
      success: res => {
        if (res.data.result) {
          if (!app.Util.checkEmpty(res.data.result.input_pic_url)) {
            that.finishRecordFace();
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
    that.setData({
      showButton: false,
      tips_title: "请将人脸放入框内"
    })
    int = setInterval(function () {
      if (that.data.face == true) {
        that.takePhoto();
      }
    }, 1000);

  },

  /**
   * 相机拍照
   */
  takePhoto: function () {
    this.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        console.log(res);
        this.setData({
          face: false
        })
        this.getCanvasImg(res.tempImagePath);
      },
      fail: function () {
        app.myLog("录入人脸失败", "相机拍照失败");
        wx.showToast({
          title: '录入人脸失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  /**
   * 上传图片
   */
  uploadCanvasImg: function (canvasImg) {
    var that = this;
    var service = 'visitor';
    var data = JSON.stringify({
      union_id: wx.getStorageSync('xy_session'),
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
        app.myLog("微信上传文件失败", "上传人脸失败");
      }
    })
  },

  /**
   * Canvas画图，压缩并获取图片
   */
  getCanvasImg: function (tempFilePath) {
    var that = this;
    const ctxv = wx.createCanvasContext('attendCanvasId');
    ctxv.drawImage(tempFilePath, 0, 0, 300, 300);
    ctxv.draw(true, function () {
      wx.canvasToTempFilePath({
        destWidth: 300,
        destHeight: 300,
        quality: 1,
        canvasId: 'attendCanvasId',
        success: function success(res) {
          that.uploadCanvasImg(res.tempFilePath);
        }, fail: function (e) {
          that.getCanvasImg(tempFilePath);
        }
      });
    });
  },

  /**
   * 结束录入人脸
   * 邀请流程跳转到invite-success
   * 发卡申请跳转到 invite-apply-result
   * 员工快捷取卡跳转到 take-card/success/index
   */
  finishRecordFace: function () {
    var that = this;
    wx.hideLoading();
    if (app.Util.checkNumber(that.data.invitation_id)) {
      wx.redirectTo({
        url: '/pages/invite-success/invite-success?vip=' + that.data.vip + '&invitation_id=' + that.data.invitation_id + '&company_id=' + that.data.company_id,
      })
    } else if (app.Util.checkNumber(that.data.visit_apply_id)) {
      wx.redirectTo({
        url: '/pages/invite-apply-result/invite-apply-result?visit_apply_id=' + that.data.visit_apply_id,
      })
    } else {
      wx.redirectTo({
        url: '/pages/employee/take-card/success/index?company_id=' + that.data.company_id,
      })
    }
  },

  getStaffInfo: function () {
    if (this.data.invitation_id !== null && this.data.invitation_id !== undefined && this.data.invitation_id !== "undefined") {
      this.getVisitorInfo();
    } else if (this.data.visit_apply_id !== null && this.data.visit_apply_id !== undefined && this.data.visit_apply_id !== "undefined") {
      this.getVisitorInfo();
    } else {
      this.getEmployeeInfo();
    }
  },

  onShow: function () {
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getStaffInfo();
      })
    } else {
      that.getStaffInfo();
      
    }
  },

  /**
   * 返回按钮
   */
  backAction: function () {
    wx.navigateBack({});
  },


  onPullDownRefresh: function () {
    this.openCameraAuth();
  }

})