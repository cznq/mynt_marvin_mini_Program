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
    pck: [{
      price: [7, 8, 4, '.', 5],
      timeLength: 12,
      discount: 7,
      savedValue: 490,
      pckInfo: '原价￥954，限时折扣'
    }, {
      price: [2, 7, 3],
      timeLength: 6,
      discount: 7,
      savedValue: 250,
      pckInfo: '原价￥784，限时折扣'
    }, {
      price: [6, 1, 9],
      timeLength: 3,
      discount: 4,
      savedValue: 120,
      pckInfo: '原价￥365，限时折扣'
    }, {
      price: [8, 4, 9],
      timeLength: 1,
      discount: null,
      savedValue: null,
      pckInfo: '原价￥12，限时折扣'
    }],
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
    console.log(e);
    let chid = e.currentTarget.dataset.pckid;
    this.setData({
      chooseId: chid
    })
  },

  // packagePay() {
  //
  //   wx.showToast({
  //     title: '你选择的套餐是' + this.data.pck[this.data.chooseId].timeLength + '个月',
  //     icon: 'none'
  //   })
  // },
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
        console.log("获取支付方式:", res);
        if (res.data.return_code === "SUCCESS") {
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
        console.log("res:", res);
        if (res.data.return_code === "SUCCESS") {
          let data = res.data
          _this.setData({
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
            timeStamp: res.data.result.wx_package.timeStamp,
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