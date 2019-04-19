// pages/businessDining/order/order.js
const app = getApp();
const util = require('../../../utils/util');
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this
    _this.get_order_list(_this)
  },
  touchTit: function(e) {
    const _this = this
    let tag = e.currentTarget.dataset.tag;
    switch (tag) {
      case '0':
        this.setData({
          book_status: 0,
          curr_page: 1
        });
        _this.get_order_list(_this, _this.data.book_status)
        break;
      case '1':
        this.setData({
          book_status: 1,
          curr_page: 1
        });
        _this.get_order_list(_this, _this.data.book_status)
        break;
      case '2':
        this.setData({
          book_status: 2,
          curr_page: 1
        });
        _this.get_order_list(_this, _this.data.book_status)
        break;
      case '3':
        this.setData({
          book_status: 3,
          curr_page: 1
        });
        _this.get_order_list(_this, _this.data.book_status)
        break;
      default:
        console.log('无效的选择');
    }
  },
  get_order_list: (_this, book_status = 0, page_size = 4, page = 1, continu = false) => {
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
        console.log('res:', res);
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
          // console.log('listItem:', listItem);
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
    const _this = this;
    if (_this.data.curr_page != _this.data.total_page) {
      let page = _this.data.curr_page + 1
      _this.setData({
        curr_page: page
      })
      _this.get_order_list(_this, _this.data.book_status, 4, _this.data.curr_page, true)
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