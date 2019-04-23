const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invSwitch: false,
    bankAccount: "", //银行账号
    bankName: "", //银行名称
    companyAddress: "", //单位地址
    errMsg: "",
    taxNumber: "", //抬头税号
    telephone: "", //手机号码
    title: "", //抬头名称
    type: 0, //0 单位 1 个人
    need_invoice: 0,
    book_id: 0,
    commerce_name: '',
    commerce_thumbnail_url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('optinons:', options);
    if (options.bookid) {
      this.setData({
        book_id: options.bookid,
        commerce_name: options.commerce_name,
        commerce_thumbnail_url: options.commerce_thumbnail_url,
        pay_price: options.pay_price
      })
    } else {
      return false
    }

  },
  chooseInvoece() {
    let _that = this;
    wx.chooseInvoiceTitle({
      success(res) {
        console.log('res:', res);
        _that.setData({
          title: res.title,
          taxNumber: res.taxNumber,
          bankAccount: res.bankAccount,
          bankName: res.bankName,
          type: res.type,
          telephone: res.telephone,
          companyAddress: res.companyAddress,
          invSwitch: true
        })

      },
      fail(res) {
        wx.showToast({
          title: res,
          icon: 'none'
        })
      }
    })
  },
  quickPay: function() {
    const _this = this;
    // 发起微信支付
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/pay",
      params: {
        data: JSON.stringify({
          book_id: _this.data.book_id,
          open_id: wx.getStorageSync('open_id'),
          need_invoice: _this.data.need_invoice,
          invoice_title: _this.data.title,
          invoice_number: _this.data.taxNumber
        })
      },
      success: res => {
        console.log('resPay:', res);
        if (res.data.result) {
          var out_order_id = res.data.result.out_order_id;
          wx.requestPayment({
            timeStamp: res.data.result.timeStamp,
            nonceStr: res.data.result.nonceStr,
            package: res.data.result.package,
            signType: 'MD5',
            paySign: res.data.result.paySign,
            success: res => {
              // console.log('支付成功');
              wx.redirectTo({
                url: '../reserve-success/index'
              })
            },
            fail: res => {
              wx.redirectTo({
                url: '../reserve-success/index'
              })
            }

          });
        } else {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none'
          })
        }

      },
      fail: res => {}
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})