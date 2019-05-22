const orderServer = require('../../../server/centers/order/order.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_status:0,
    curr_page: 1,
    noneData: {
      textInfo: '暂无交易记录',
      buttonText: '',
      emptyBtnFunc: '',
      show: false
    },
    orderList: [],
    forbid: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderRecord(this,0, 1, 5)
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
    wx.pageScrollTo({
      scrollTop: 0
    })
    // _this.get_order_list(_this, _this.data.book_status)
  },
  getOrderRecord: function(that, order_type, page, page_size) {
    orderServer.getOrderList(order_type, page, page_size).then(res => {
      console.log("获取订单记录:", res);
      if (res.data.return_code === "SUCCESS" && res.data.result) {
        let data = res.data.result.record_list
        const newOrderList = that.data.orderList.concat(data)
        that.setData({
          orderList: newOrderList,
          total_page: res.data.result.total_page
        }, () => {
          if (that.data.orderList.length === 0) {
            that.setData({
              ['noneData.show']: true
            })
          } else {
            that.setData({
              ['noneData.show']: false
            })
          }
        })

      } else {
        if (res.data.return_code !== 0 && res.data.sub_msg) {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none'
          })
        }
        that.setData({
          ['noneData.show']: true
        })
      }
    }).catch(res =>{
      console.log(res);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    if (this.data.curr_page != this.data.total_page) {
      let page = this.data.curr_page + 1
      this.setData({
        curr_page: page
      })
      this.getOrderRecord(this, this.data.curr_page, 5)
    } else {
      wx.showToast({
        title: '我们是有底线的哦！',
        icon: 'none'
      })
    }
  }

})
