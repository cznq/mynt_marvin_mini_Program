// pages/suite-introduce/suite-introduce.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    service_suite: 0,
    isiphoneX: app.globalData.isIphoneX,
    union_id: wx.getStorageSync('xy_session'),
    showModal: false,
    canvasWidth: 375,
    canvasHeight: 667
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.getSuiteInfos();
    
  },

  openConfirm: function () {
    wx.showModal({
      content: '检测到您没打开保存到相册权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },

  /**
   * 立即支付
   */
  quickPay: function () {

    // this.setData({
    //   showModal: true
    // });
    
    // 发起微信支付
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'wechat',
        method: 'pay',
        data: JSON.stringify({
          pay_service: 'BUSINESS_SUITE'
        })
      },
      success: res => {
        if (res.data.result) {
          var out_order_id = res.data.result.out_order_id;
          wx.requestPayment({
            timeStamp: JSON.stringify(res.data.result.wx_package.timeStamp),
            nonceStr: res.data.result.wx_package.nonceStr,
            package: res.data.result.wx_package.package,
            signType: 'MD5',
            paySign: res.data.result.wx_package.paySign,
            success: res => {
              console.log('支付成功');   
            },
            fail: res => {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
            },
            complete: res => {
              
              wx.redirectTo({
                url: '/benifit/pages/pay-status/index?out_order_id=' + out_order_id
              })
            }
            
          });
        }
        
      },
      fail: res => {}
    })

  },
  searchOrderInfo(out_order_id){
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'pay',
        method: 'get_order_info',
        data: JSON.stringify({
          out_order_id: out_order_id
        })
      },
      success: res => {
        if (res.data.result.status==1) {
          
        }

      },
      fail: res => { }
    })
  },
  /**
   * 关闭弹出框
   */
  closeModal: function () {
    this.setData({
      showModal: false
    });
  },

  /**
   * 保存到本地
   */
  saveToLocal: function () {
    var self = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: self.data.canvasWidth,
      height: self.data.canvasHeight,
      destWidth: self.data.canvasWidth * 2,
      destHeight: self.data.canvasHeight * 2,
      canvasId: 'inviteCanvas',
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

  /**
   * 圆角图片 
   */
  circleImg(ctx, img, x, y, w, h, r, callback = function () { }) {
    var that = this;
    wx.getImageInfo({
      src: img,
      success: function (res) {
        console.log(res);
        ctx.save();
        ctx.beginPath(); //开始绘制
        //先画个圆角矩形
        that.roundRect(ctx, x, y, w, h, r, '#fff');
        ctx.clip();
        ctx.drawImage(res.path, x, y, w, h);
        ctx.restore();
        callback();
      }
    })
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
   * 绘制网络图片
   */
  drawNetworkPhoto(ctx, img, x, y, w, h, callback = function () { }) {
    wx.getImageInfo({
      src: img,
      success: function (res) {
        console.log(res);
        ctx.drawImage(res.path, x, y, w, h);
        callback();
      }
    })
  },
  /**
   * 绘制二维码邀请图
   */
  drawQrcodePhoto(ctx) {
    //背景色
    this.drawRect(ctx, 0, 0, this.data.canvasWidth, this.data.canvasHeight, '#0084FF');
    //公司logo
    //this.circleImg(ctx, this.data.companyInfo.logo, 156, 47, 64, 64, 8);
    //卡片背景色
    this.roundRect(ctx, 26, 77, 323, 481, 8, '#fff');
    //卡片左圆点
    this.drawDot(ctx, 25, 182, 8, '#0084FF');
    //卡片右圆点
    this.drawDot(ctx, 350, 182, 8, '#0084FF');
    //分割线
    this.drawRect(ctx, 33, 182, 308, 1, '#f9f9f9');
    //公司名字
    this.drawText(ctx, 22, '#000', 'center', '商业服务套件付费', 187, 130);
    //公司别称
    this.drawText(ctx, 12, '#8891A9', 'center', '超值商业服务套件月费低至198元/月', 187, 150);
    //二维码标题
    this.drawText(ctx, 18, '#1A2A4B', 'center', '付费二维码', 187, 223);
    //二维码边框
    ctx.setStrokeStyle('#DDDDDD')
    ctx.setLineWidth(7)
    ctx.strokeRect(87, 244, 202, 202)
    //二维码描述
    this.drawText(ctx, 14, '#8891A9', 'center', '请退出小程序，回到微信App，点击右上角', 187, 480);
    this.drawText(ctx, 14, '#8891A9', 'center', '“+”按钮，在菜单中选择“扫一扫”，然后点', 187, 500);
    this.drawText(ctx, 14, '#8891A9', 'center', '击右上角“相册”按钮，找到相册中的这张图', 187, 520);
    this.drawText(ctx, 14, '#8891A9', 'center', '片，进行支付。同时支持支付宝支付。', 187, 540);
  },

  /**
   * 生成二维码邀请图
   */

  getInviteQrcodePhoto: function (e) {

    var that = this;
    const ctxv = wx.createCanvasContext('inviteCanvas');
    that.drawQrcodePhoto(ctxv);
    wx.getImageInfo({
      src: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/pay_qrcode.png',
      success: function (res) {
        ctxv.drawImage(res.path, 94, 251, 188, 188);
        wx.getImageInfo({
          src: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/canvas-logo.png',
          success: function (res) {
            ctxv.drawImage(res.path, 107, 595, 160, 29);
            ctxv.draw(true, function () { that.saveToLocal() })
          }
        })
      }
    })

  },


  getSuiteInfos: function() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_service_pack_html_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res);
        if (res.data.result) {
            that.setData({
              phone: res.data.result.phone,
              cost_price: res.data.result.cost_price,
              current_price: res.data.result.current_price,
              image: res.data.result.image,
            })
        }
      }
    })
  },
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  }
})