var canvasKit = require('../../../../utils/canvasKit.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    staffCount: 0,
    staffList: [{
        "employee_id": 1,
        "union_id": "o3iamjh_tpecJOwgrAhWHM7CQb2k",
        "name": "李四",
        "phone": "130xxxxxxxx",
        "role": 0,
        "owner_id": 1,
        "manage_asset_count": 0,
        "manage_asset_total_amount": 0
      }
    ],
    noneData: {
      pointer: true,
      title: '暂无资产',
      textInfo: '添加人员，帮助您添加资产、核销缴费',
      picSize: {
        width: '180rpx',
        height: '156rpx',
        marginTop: '178rpx'
      },
      pic: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/no-staff%402x.png'
    },
    qrinco: '长按识别二维码\n关注公众号 进行身份绑定'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.saveInviteCard();
  },

  drawInviteCard: function (ctx) {
    //企业个人图标
    canvasKit.roundRect(ctx, 20, 20, 35, 18, 3, '#fff');
    canvasKit.drawText(ctx, 12, '#8891A9', 'center', '企业', 38, 34);
    //企业名称
    canvasKit.drawText(ctx, 23, '#FFFFFF', 'left', '轻客智能科技(江苏)有限公司', 20, 66);
    canvasKit.drawText(ctx, 16, '#8891A9', 'left', '邀请您管理资产', 20, 90);
    //中间白色圆角矩形
    canvasKit.roundRect(ctx, 20, 118, 295, 319, 4, '#FFFFFF');
    //邀请人
    canvasKit.drawText(ctx, 20, '#092344', 'center', '谢林允', 167, 160);
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
    //canvasKit.drawNetworkPhoto(ctxv, 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/pay_qrcode.png', 146, 47, 80, 80, function () {_this.drawInviteCard(ctxv);})

    _this.drawInviteCard(ctxv);
    wx.getImageInfo({
      src: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/pay_qrcode.png',
      success: function (res) {
        ctxv.save();
        ctxv.beginPath(); //开始绘制
        ctxv.drawImage(res.path, 128, 170, 80, 80);
        ctxv.restore();
        ctxv.draw(true, function () {  })
      }
    })

  }

 

 

})