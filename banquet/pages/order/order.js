// pages/businessDining/order/order.js
const app = getApp();
const util = require('../../../utils/util');
const utilCal = require('../../../utils/floating-point.js');
const Moment = require('../../../utils/moment.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // orderTitle: 'all',
    book_status: 0, //查询状态 0 全部|1 待确定| 2 待消费 | 3  待支付
    totalCount: 0,
    total_page: 0,
    listItem: [],
    curr_page: 1,
    searchNoneData: {
      textInfo: '暂无订单',
      show: false
    },
    isInitRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this
    _this.Get_order_list(_this)
  },
  touchTit: function(e) {
    wx.pageScrollTo({
      scrollTop: 0
    })
    const _this = this
    let tag = e.currentTarget.dataset.tag;
    switch (tag) {
      case '0':
        this.setData({
          book_status: 0,
          curr_page: 1
        });
        break;
      case '1':
        this.setData({
          book_status: 1,
          curr_page: 1
        });
        break;
      case '2':
        this.setData({
          book_status: 2,
          curr_page: 1
        });
        break;
      case '3':
        this.setData({
          book_status: 3,
          curr_page: 1
        });
        break;
      default:
        console.log('无效的选择');
        break;
    }
    _this.get_order_list(_this, _this.data.book_status)
  },
  /**
   * 请求参数 requestHandler
   * book_status
   * page_size
   * page
   * continu       true | false
   */
  get_order_list: (_this, book_status = 0, page_size = 10, page = 1, continu = false) => {
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/get_order_list",
      params: {
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          book_status: book_status,
          page_size: page_size,
          page: page
        })
      },
      success: res => {
        console.log('订单列表:', res);
        let data = res.data
        if (data.sub_code == "SUCCESS") {
          let totalCount = data.result.total_count;
          let total_page = data.result.total_page;
          let listItem = data.result.data
          if (listItem.length == 0) {
            _this.setData({
              ['searchNoneData.show']: true
            })
            return false
          } else {
            _this.setData({
              ['searchNoneData.show']: false
            })
          }
          if (continu) {
            listItem = _this.data.listItem.concat(data.result.data);
          }
          for (let item of listItem) {
            for (var o in item) {
              if (item['book_type'] === 2) { //宴请
                let appointmentTime = util.formatTime(item.appointment_time, 2)
                item.appointmentTime = appointmentTime;
                break;
              } else { //酒店
                let bookBeginTime = util.formatTime(item.book_begin_time, 3)
                let bookEndTime = util.formatTime(item.book_end_time, 3)
                let dateDiff_Day = util.dateDiff_Day(bookBeginTime, bookEndTime)
                item.bookBeginTime = bookBeginTime;
                item.bookEndTime = bookEndTime;
                item.dateDiff_Day = dateDiff_Day;
                break;
              }
            }
          }
          _this.setData({
            totalCount: totalCount,
            total_page: total_page,
            listItem: listItem
          })
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
          })
        }
      },
      fail: res => {
        console.log('fail');
        wx.showToast({
          title: res.errMsg,
          none: 'none'
        })
      }
    })
  },
  Get_order_list: (_this, book_status = 0, page_size = 10, page = 1, continu = false) => {
    app.server.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/get_order_list",
      params: {
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          book_status: book_status,
          page_size: page_size,
          page: page
        })
      }
    }).then(res => {
      console.log('订单列表:', res);
    })
  },
  currDetil: (e) => {
    // console.log('e:', e);
    const bookid = e.currentTarget.dataset.bookid;
    const pages = getCurrentPages();
    const currPage = pages[pages.length - 1];
    currPage.setData({
      isInitRefresh: true
    })
    wx.navigateTo({
      url: '../orderDetail/orderDetail?bookid=' + bookid
    })
  },
  /**
   * 立即支付
   */
  quickPay: function(e) {
    const commerce_name = e.currentTarget.dataset.commerce_name;
    const commerce_thumbnail_url = e.currentTarget.dataset.commerce_thumbnail_url;
    const pay_price = utilCal.divide(parseFloat(e.currentTarget.dataset.pay_price), 100, 0);
    const bookid = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '../cashier/cashier?bookid=' + bookid + '&commerce_name=' + commerce_name + '&commerce_thumbnail_url=' + commerce_thumbnail_url +
        '&pay_price=' + pay_price + '&source=' + 'order'
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
    const _this = this
    _this.setData({
      curr_page: 1
    })
    if (_this.data.isInitRefresh) {
      _this.get_order_list(_this, _this.data.book_status)
    }
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
    const _this = this
    _this.setData({
      curr_page: 1
    })
    _this.get_order_list(_this, _this.data.book_status, 10, 1, false)
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 0)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const _this = this;
    if (_this.data.curr_page != _this.data.total_page && _this.data.totalCount < 10) {
      let page = _this.data.curr_page + 1
      _this.setData({
        curr_page: page
      })
      _this.get_order_list(_this, _this.data.book_status, 10, _this.data.curr_page, true)
    } else {
      wx.showToast({
        title: '我们是有底线的哦！',
        icon: 'none'
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
