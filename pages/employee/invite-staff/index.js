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
    companyInfo: null
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
      url: self.data.qrcodeUrl,
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
   * 生成邀请图
   */
  getInvitePhoto: function () {
    console.log('ok');
    var that = this;
    const ctxv = wx.createCanvasContext('inviteCanvas');
    ctxv.drawImage(that.data.companyInfo.logo, 0, 0, 300, 300);
    ctxv.setStrokeStyle("#00ff00")
    ctxv.setLineWidth(5)
    ctxv.rect(310, 0, 200, 200)
    ctxv.stroke()
    ctxv.draw(true, function () {
      wx.canvasToTempFilePath({
        destWidth: 300,
        destHeight: 600,
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
          that.getInvitePhoto(that.data.companyInfo.company_logo);
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