const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteModal: {
      showModal: false,
      inviteType: 'code',
    },
    companyInfo: null,
    canvasWidth: 375,
    canvasHeight: 667
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        this.getCompanyInfo();
      })
    } else {
      this.getCompanyInfo();
    }
  },

  /**
   * 获取公司信息
   * Param: company_id (公司id)
   */
  getCompanyInfo: function () {

    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res.data);
        if (res.data.result) {
          that.setData({
            companyInfo: res.data.result
          })
        }
       
      }
    })
  },

  /**
   * 复制邀请码
   */
  copyInviteCode: function (e) {
    var that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success: function (res) {
        console.log(res);
      }
    })
  },

  /**
   * 打开邀请
   * method    code为邀请码方式，qrcode为二维码方式 
   */
  inviteOpen: function (e) {
    console.log(e);
    var method = e.currentTarget.dataset.method;
    if (method == 'code') {
      this.setData({ canvasHeight: 549});
    }
    this.setData({
      'inviteModal.showModal': true,
      'inviteModal.inviteType': method
    });
  },

  /**
   * 关闭弹出框
   */
  closeModal: function () {
    this.setData({
      'inviteModal.showModal': false
    });
  },

  /**
   * 保存到本地
   */
  saveToLocal: function () {
    var self = this;
    wx.downloadFile({
      url: self.data.companyInfo.company_qrcode_url,
      success: function (ret) {
        var path = ret.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            });

          },
          fail: function (result) {}
        })
      }
    })
  },

  /**
   * 圆角图片 
   */
  circleImg: function (ctx, img, x, y, w, h, r) {
    ctx.save();
    ctx.beginPath(); //开始绘制
    //先画个圆角矩形
    this.roundRect(ctx, x, y, w, h, r, '#fff');
    ctx.clip();// 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    ctx.drawImage(img, x, y, w, h); // 推进去图片
    ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
    
  },

  /**
   * 绘制带圆角的矩形
   */
  roundRect(ctx, x, y, w, h, r, bg) {
    // 开始绘制
    ctx.beginPath()
    ctx.setFillStyle(bg)
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)
    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    ctx.closePath()
    
  },

  /**
   * 绘制居中文字
   */
  drawText(ctx, fontSize, fontColor, align, Text, x, y) {
    ctx.setFontSize(fontSize)
    ctx.setFillStyle(fontColor)
    ctx.setTextAlign(align)
    ctx.fillText(Text, x, y)
  },

  /**
   * 画圆点
   */
  drawDot(ctx, x, y, r, bg) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.setFillStyle(bg)
    ctx.fill()
  },

  /**
   * 画矩形
   */
  drawRect(ctx, x, y, w, h, bg) {
    ctx.setFillStyle(bg);
    ctx.fillRect(x, y, w, h);
  },

  /**
   * 绘制二维码邀请图
   */
  drawQrcodePhoto(ctx) {
    //背景色
    //var that = this;

    //卡片背景色
    this.roundRect(ctx, 26, 77, 323, 481, 8, '#fff');
    //卡片左圆点
    this.drawDot(ctx, 25, 202, 8, '#0084FF');
    //卡片右圆点
    this.drawDot(ctx, 350, 202, 8, '#0084FF');
    //分割线
    this.drawRect(ctx, 33, 202, 308, 1, '#f9f9f9');

    //公司logo
    this.circleImg(ctx, this.data.companyInfo.logo, 156, 47, 64, 64, 8);
    //公司名字
    this.drawText(ctx, 22, '#000', 'center', this.data.companyInfo.company_short_name, 187, 150);
    //公司别称
    this.drawText(ctx, 12, '#8891A9', 'center', this.data.companyInfo.company_name, 187, 170);
    //二维码标题
    this.drawText(ctx, 21, '#1A2A4B', 'center', '邀请二维码', 187, 253);
    //二维码边框
    ctx.setStrokeStyle('#DDDDDD')
    ctx.setLineWidth(7)
    ctx.strokeRect(87, 284, 202, 202)
    //二维码
    ctx.drawImage(this.data.companyInfo.company_qrcode_url, 94, 291, 188, 188);
    //二维码描述
    this.drawText(ctx, 14, '#8891A9', 'center', '扫描二维码申请加入公司', 187, 520);

    //底部logo
    ctx.drawImage('https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/canvas-logo.png', 107, 595, 160, 29);
   
  },

  /**
   * 绘制公司码邀请图
   */
  drawCodePhoto(ctx) {
    //背景色
    //var that = this;

    //卡片背景色
    this.roundRect(ctx, 26, 77, 323, 364, 8, '#fff');
    //卡片左圆点
    this.drawDot(ctx, 25, 202, 8, '#0084FF');
    //卡片右圆点
    this.drawDot(ctx, 350, 202, 8, '#0084FF');
    //分割线
    this.drawRect(ctx, 33, 202, 308, 1, '#f9f9f9');

    //公司logo
    this.circleImg(ctx, this.data.companyInfo.logo, 156, 47, 64, 64, 8);
    //公司名字
    this.drawText(ctx, 22, '#000', 'center', this.data.companyInfo.company_short_name, 187, 150);
    //公司别称
    this.drawText(ctx, 12, '#8891A9', 'center', this.data.companyInfo.company_name, 187, 170);
    //二维码标题
    this.drawText(ctx, 21, '#1A2A4B', 'center', '邀请码', 187, 253);
    //公司码
    this.roundRect(ctx, 50, 284, 273, 84, 8, '#F2F4F7');
    this.drawText(ctx, 45, '#21262F', 'center', this.data.companyInfo.company_code, 187, 342);
    //二维码描述
    this.drawText(ctx, 14, '#8891A9', 'center', '扫描二维码申请加入公司', 187, 400);

    //底部logo
    ctx.drawImage('https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/canvas-logo.png', 107, 477, 160, 29);
  },

  /**
   * 生成邀请图
   */
  getInvitePhoto: function (e) {
    var ch = e.currentTarget.dataset.by; 
    console.log(ch);
    var that = this;
    const ctxv = wx.createCanvasContext('inviteCanvas');
    that.drawRect(ctxv, 0, 0, that.data.canvasWidth, that.data.canvasHeight, '#0084FF');
  
    if (ch == 'code') {
      that.drawCodePhoto(ctxv);
    } else {
      that.drawQrcodePhoto(ctxv);
    }
    
    ctxv.draw(true, function () {
      wx.canvasToTempFilePath({
        destWidth: that.data.canvasWidth,
        destHeight: that.data.canvasHeight,
        canvasId: 'inviteCanvas',
        success: function success(res) {
          console.log(res.tempFilePath);
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(result) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 1000
              });
            }
          })
        }, 
        fail: function (e) {
          that.getInvitePhoto();
        }
      });
    });
    
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (res) {
    return {
      title: '邀请加入' + this.data.companyInfo.company_name,
      path: '/pages/invite-receive/invite-receive?vip=yes&invitation_id=' + this.data.invitation_id,
      success: function (res) {},
      fail: function (res) {}
    }
  }
})