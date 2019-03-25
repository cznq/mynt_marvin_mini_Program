// pages/businessService/servicePay/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    pckList: [],
    end_time: '',
    business_service_suite_status: null, // 0：未开通，1：已开通，2：已过期
    chooseId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCompany(this);
    this.get_suite_type(this);
    this.get_end_time(this);
  },

  choosePck: function(e) {
    // console.log(e);
    let chid = e.currentTarget.dataset.pckid;
    this.setData({
      chooseId: chid
    })
  },
  /**
   * 获取支付方式
   */
  get_suite_type: function(_this) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_suite_period_type',
        data: JSON.stringify({}),
      },
      success: res => {
        // console.log("获取支付方式:", res);
        if (res.data.return_code === "SUCCESS" && res.data.result) {
          let data = res.data.result
          for (let obj of data) {
            for (let i in obj) {
              let price_arr = obj['real_money'].toString().split('')
              obj.price_arr = price_arr
            }
          }
          _this.setData({
            pckList: data
          })
        }
      }
    })
  },
  get_end_time: function(_this) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_business_service_suite_status',
        data: JSON.stringify({}),
      },
      success: res => {
        // console.log("res:", res);
        if (res.data.return_code === "SUCCESS") {
          let data = res.data
          _this.setData({
            business_service_suite_status: data.result.business_service_suite_status,
            end_time: data.result.end_time
          })

        }

      }
    })
  },
  /**
   * 获取公司信息
   */
  getCompany: function(_this) {
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
        if (res.data.result) {
          _this.setData({
            cmpInfo: res.data.result
          })

        }

      }
    })
  },
  /**
   * 立即支付
   */
  quickPay: function() {
    let customization_id = this.data.pckList[this.data.chooseId].customization_id
    // 发起微信支付
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'wechat',
        method: 'pay',
        data: JSON.stringify({
          pay_service: 'BUSINESS_SUITE',
          customization_id: customization_id
        })
      },
      success: res => {
        if (res.data.result) {
          var out_order_id = res.data.result.out_order_id;
          wx.requestPayment({
            timeStamp: res.data.result.wx_package.timeStamp,
            nonceStr: res.data.result.wx_package.nonceStr,
            package: res.data.result.wx_package.package,
            signType: 'MD5',
            paySign: res.data.result.wx_package.paySign,
            success: res => {
              console.log('支付成功');
              wx.redirectTo({
                url: '../vipStatus/vipStatus'
              })
            },
            fail: res => {
              wx.showToast({
                title: '支付失败',
                icon: 'none'
              })
            },
            complete: res => {
              wx.redirectTo({
                url: '/benifit/pages/pay-status/index?out_order_id=' + out_order_id + '&pay_from=package'
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