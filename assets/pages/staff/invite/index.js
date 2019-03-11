var canvasKit = require('../../../../utils/canvasKit.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    qrinco: '长按识别二维码\n关注公众号 进行身份绑定',
    assetId: '',
    assetOwner: '',
    invitee: '谢谢谢',
    canvasWidth: 335,
    canvasHeight: 460
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type==2){
      var assetId = '个人',
        assetOwner = options.name + '田倩的资产'
    } else {
      var assetId = '企业',
        assetOwner = options.name
    }
    this.setData({
      invitee: options.invitee,
      assetId: assetId,
      assetOwner: assetOwner
    })
    
  },

  /**
   * 保存到本地
   */
  saveToLocal: function (self) {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: self.data.canvasWidth,
      height: self.data.canvasHeight,
      destWidth: self.data.canvasWidth * 2,
      destHeight: self.data.canvasHeight * 2,
      canvasId: 'inviteCard',
      quality: 1,
      success: function success(res) {
        //判断是否获得了用户保存到相册授权
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.writePhotosAlbum'] == false) {
              self.openConfirm();
            }
          }
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            });
          },
          fail: function () {
            console.log('保存不成功');
          }
        })
      },
      fail: function (e) {
        console.log(e);
      }
    });

  },

  drawInviteCard: function (_this, ctx) {
    //条纹背景
    //canvasKit.linearGradientRect(ctx, 0, 0, _this.data.canvasWidth, _this.data.canvasHeight);
    canvasKit.roundRect(ctx, 0, 0, _this.data.canvasWidth, _this.data.canvasHeight, 10, '#092344');
    //企业个人图标
    canvasKit.roundRect(ctx, 20, 20, 35, 18, 3, '#fff');
    canvasKit.drawText(ctx, 12, '#8891A9', 'center', _this.data.assetId, 38, 34);
    //企业名称
    canvasKit.drawText(ctx, 23, '#FFFFFF', 'left', _this.data.assetOwner, 20, 66);
    canvasKit.drawText(ctx, 16, '#8891A9', 'left', '邀请您管理资产', 20, 90);
    //中间白色圆角矩形
    canvasKit.roundRect(ctx, 20, 118, 295, 319, 4, '#FFFFFF');
    //邀请人
    canvasKit.drawText(ctx, 20, '#092344', 'center', _this.data.invitee, 167, 160);
    //二维码下面文字
    canvasKit.fillText(ctx,'长按识别二维码\n关注公众号 进行身份绑定', 167, 256, 12, '#8891A9', 20, 'center');
    canvasKit.drawDashLineRect(ctx, 33, 325, 270, 80, 5);
    canvasKit.fillText(ctx, '绑定成功后可在小程序中\n进行添加本企业或本人所租售的资产信息\n并为资产相关费用的账目进行智能核销', 167, 334, 12, '#b5bdc7', 20, 'center');
    canvasKit.drawDot(ctx, 167, 445, 25, "#092344"); 
    ctx.draw(true, function () {  })
  },

  saveInviteCard: function() {
    var _this = this;
    const ctxv = wx.createCanvasContext('inviteCard');
    _this.drawInviteCard(_this, ctxv);
    wx.getImageInfo({
      src: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/pay_qrcode.png',
      success: function (res) {
        ctxv.save();
        ctxv.beginPath(); //开始绘制
        ctxv.drawImage(res.path, 128, 170, 80, 80);
        ctxv.restore();
        ctxv.draw(true, function () { 
          _this.saveToLocal(_this) 
        })
      }
    })

  }

 

 

})