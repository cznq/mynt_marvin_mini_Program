var md5 = require('../../../utils/md5.js');
var app = getApp()
Page({

  /**
   * 录入人脸信息公共页面
   * 邀请流程，员工快捷取卡，员工信息录入, 员工人脸修改，申请发卡，协议商户
   * Param: 
   *   source (来源) | params (参数)                               | callback（回调）
   *   invite       | form_id                                     | /pages/invite-visitor/success/index?invitation_id
   *   takeCard     | card_type                                   | /pages/employee/take-card/success/index 或者  /pages/e-card/detail/index
   *   editInfo     | company_id                                  | /pages/employee/homepage/index
   *   reRecodeFace | company_id                                  | /pages/employee/homepage/index
   *   applyVisit   | company_id, form_id, visitor_name, note     | /pages/apply-visit/applicationStatus/index?visit_apply_id
   *   benifit      | commerce_id                                 | /benifit/pages/vip-card/vip-card
   */

  data: {
    isIphoneX: app.globalData.isIphoneX,
    options: {},
    face: true,
    ctx: {},
    showButton: true,
    cameraErrorText: ""
  },

  onLoad: function (options) {
    //console.log(options);
    var that = this;
    that.data.options.source = options.source;
    that.data.options.params = JSON.parse(options.params);
    that.data.options.idInfo = JSON.parse(options.idInfo);

    if (app.Util.checkcanIUse('camera')) {
      app.myLog('相机检测', '相机组件检测通过');
      that.setData({
        ctx: wx.createCameraContext()
      }) 
      
    }
    app.Util.checkcanIUse('cover-view');
  },

  cameraError: function () {
    app.myLog('取消打开摄像头授权', '你已经取消了人脸录入的授权');
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
                      wx.navigateBack();
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
    var k = 0;
    int = setInterval(function () {
      if (that.data.face == true && k > 2) {
        app.myLog('开始拍照', k);
        that.takePhoto(that.data.ctx);
      }
      k++;
    }, 1000);

  },

  /**
   * 相机拍照
   */
  takePhoto: function (ctx) {
    app.myLog('调用相机拍照事件：', JSON.stringify(ctx));
    var that = this;
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        console.log(res);
        that.setData({
          face: false
        })
        that.getCanvasImg(res.tempImagePath);
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
  uploadCanvasImg(canvasImg, company_id, op_type, user_type, phone, id_type, id_number, callback = function () {}) {
    var that = this;
    var data = JSON.stringify({
      union_id: wx.getStorageSync('xy_session'),
      company_id: company_id,
      op_type: op_type,
      user_type: user_type,
      phone: phone,
      id_type: id_type,
      id_number: id_number
    });
    console.log(data);
    var service = 'visitor';
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
        var data = JSON.parse(res.data);
        console.log(data);
        app.myLog('上传人脸图片', JSON.stringify(data));
        if (data.sub_code == 0) {
          console.log('++++++++++++' + data.sub_code + '+++++++++' + data.sub_code);
          wx.showLoading({ title: '人脸上传中' });
          callback();
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
          // invite,takeCard,editInfo,applyVisit,benifit
          
          if (that.data.options.source == 'invite') {
            var op_type = 0, user_type = 0;
            that.uploadCanvasImg(res.tempFilePath, that.data.options.params.company_id, op_type, user_type, that.data.options.idInfo.phone, that.data.options.idInfo.id_type, that.data.options.idInfo.id_number, function () {
              app.receiveSubmit(that.data.options.params.invitation_id, that.data.options.params.form_id, function () {
                wx.hideLoading();
                wx.redirectTo({
                  url: '/pages/invite-visitor/success/index?invitation_id=' + that.data.options.params.invitation_id,
                })
              }) 
            });
            
          } else if (that.data.options.source == 'applyVisit') {
            var op_type = 0, user_type = 0;
            that.uploadCanvasImg(res.tempFilePath, that.data.options.params.company_id, op_type, user_type, that.data.options.idInfo.phone, that.data.options.idInfo.id_type, that.data.options.idInfo.id_number, function () {
              app.applySubmit(that.data.options.params.visit_company_id, that.data.options.params.form_id, that.data.options.params.visitor_name, that.data.options.params.note, function (visit_apply_id) {
                wx.hideLoading();
                wx.redirectTo({
                  url: '/pages/apply-visit/applicationStatus/index?visit_apply_id=' + visit_apply_id,
                })
              }) 
            });
           
          } else if (that.data.options.source == 'takeCard') {
            var op_type = 0, user_type = 2;
            that.uploadCanvasImg(res.tempFilePath, that.data.options.params.company_id, op_type, user_type, that.data.options.idInfo.phone, that.data.options.idInfo.id_type, that.data.options.idInfo.id_number, function () {              
              wx.hideLoading();
              if (that.data.options.params.card_type == 'card') {
                wx.redirectTo({
                  url: '/pages/employee/take-card/success/index?company_id=' + that.data.options.params.company_id,
                })
              } else {
                wx.redirectTo({
                  url: '/pages/e-card/detail/index'
                })
              }
                
            });
            
          } else if (that.data.options.source == 'editInfo') {
            var op_type = 0, user_type = 2;
            that.uploadCanvasImg(res.tempFilePath, that.data.options.params.company_id, op_type, user_type, that.data.options.idInfo.phone, that.data.options.idInfo.id_type, that.data.options.idInfo.id_number, function () {
              wx.hideLoading();
              wx.redirectTo({
                url: '/pages/employee/homepage/index',
              })
              
            });
            
          } else if (that.data.options.source == 'reRecodeFace') {
            var op_type = 1, user_type = 2;
            that.uploadCanvasImg(res.tempFilePath, that.data.options.params.company_id, op_type, user_type, that.data.options.idInfo.phone, that.data.options.idInfo.id_type, that.data.options.idInfo.id_number, function () {
              wx.hideLoading();
              wx.redirectTo({
                url: '/pages/employee/homepage/index',
              })
            });
          }


        }, fail: function (e) {
          that.getCanvasImg(tempFilePath);
        }
      });
    });
  },


  onShow: function () {
    this.openCameraAuth();
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