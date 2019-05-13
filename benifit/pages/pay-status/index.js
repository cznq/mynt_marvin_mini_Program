// pages/suite-introduce/suite-introduce.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 'wait',
    phone: '0571-82617637',
    pay_from: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.setData({
      pay_from: options.pay_from
    })
    if (options.pay_from == 'commerce') {
      _this.searchOrderInfo_benifit(_this, options.out_order_id, app.globalData.BANQUET_API_URL + "/customer/order_info");
    } else if (options.pay_from == 'package') {
      _this.searchOrderInfo(_this, options.out_order_id, app.globalData.BASE_API_URL);
    }

  },
  //套餐订单查询
  searchOrderInfo_benifit(_this, out_order_id, requestUrl) {
    app.request.requestApi.post({
      url: requestUrl,
      params: {
        data: JSON.stringify({
          out_order_id: out_order_id
        })
      },
      success: res => {
        console.log('order_info:', res);
        if (res.data.result) {
          if (res.data.result.status == 1) {
            _this.setData({
              status: 'success'
            })
          } else if (res.data.result.status == 0) {
            _this.setData({
              status: 'fail'
            })
          }
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
  //套餐订单查询
  searchOrderInfo(_this, out_order_id, requestUrl) {
    app.Util.network.POST({
      url: requestUrl,
      params: {
        service: 'pay',
        method: 'get_order_info',
        data: JSON.stringify({
          out_order_id: out_order_id
        })
      },
      success: res => {
        if (res.data.result) {
          if (res.data.result.status == 1) {
            _this.setData({
              status: 'success'
            })
          } else if (res.data.result.status == 0) {
            _this.setData({
              status: 'fail'
            })
          }
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

  makePhoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  backPay() {
    if (this.data.pay_from == 'commerce') {
      if (this.data.status == "success") {
        wx.navigateBack({
          delta: 2
        })
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
    } else if (this.data.pay_from == 'package') {
      if (this.data.status == "success") {
        wx.redirectTo({
          url: '/pages/businessService/vipStatus/vipStatus',
        })
      } else {
        wx.redirectTo({
          url: '/pages/businessService/servicePay/index',
        })
      }

    }

  }
})