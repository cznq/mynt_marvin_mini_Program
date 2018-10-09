// pages/mall-detail/mall-detail.js
const app = getApp();
var wxParse = require('../../vendor/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    slide_data: {
      thumbnail_url: [],
      indicatorDots: false,
      autoplay: true,
      interval: 20000,
      duration: 1000
    },
    curPosition: "discSec",
    showVipCard: false,
    is_vip: false,
    commerce_id: null,
    commerce_type: null,
    commerceDetail: null,
    employeeInfo: null,
    protocolInfo: null,
    commentList: null,
    rate: 2,
    dialog_discount: null,
    dialog_discount_limit: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      commerce_id: options.commerce_id,
      commerce_type: options.commerce_type
    })
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getEmployeeInfo();
        that.getDetailInfo(that.data.commerce_id);
      })
    } else {
      that.getDetailInfo(that.data.commerce_id);
      that.getEmployeeInfo();
    }
  },

  /**
   * 获取员工信息
   */
  getEmployeeInfo() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({})
      },
      success: res => {
        //console.log(res.data.result);
        if (res.data.result) {
          if (res.data.result.has_employee_benefit == 1) {
            that.setData({
              is_vip: true
            })
          }
          that.setData({
            employeeInfo: res.data.result
          })
        }
      }
    })
  },

  /**
   * 获取商家详情
   */
  getDetailInfo(commerce_id) {
    var that = this;
    var slide_img = "slide_data.thumbnail_url";
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'commerce',
        method: 'get_commerce_info',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          commerce_id: commerce_id
        })
      },
      success: res => {
        wxParse.wxParse('details', 'html', res.data.result.details, that, 5);
        if (res.data.result) {
          that.setData({
            commerceDetail: res.data.result,
            [slide_img]: res.data.result.thumbnail_url
          })
        }
        that.getProtocol(commerce_id, that.data.commerce_type);
        that.getComments(commerce_id);
      }
    })
  },

  /**
   * 获取商家优惠协议
   */
  getProtocol(commerce_id, typeid) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'commerce',
        method: 'get_commerce_discount',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          commerce_id: commerce_id,
          type: typeid
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            protocolInfo: res.data.result
          })
        }
      }
    })
  },

  /**
   * 获取评论信息
   */
  getComments(commerce_id) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'commerce',
        method: 'get_comment_list',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          commerce_id: commerce_id
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            commentList: res.data.result
          })
        }
      }
    })
  },

  gotoView: function() {
    this.setData({
      curPosition: 'comtSec'
    })
    console.log("click");
  },

  /**
   * 关闭VIP卡弹窗
   */
  closeDialog: function () {
    this.setData({
      showVipCard: false
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
  },

  /**
   * 协议买单
   */
  cardTopay: function (e) {
    this.setData({
      showVipCard: true,
      dialog_discount: e.currentTarget.dataset.discount,
      dialog_discount_limit: e.currentTarget.dataset.limit,
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000',
    })
  },

  /**
   * 查看幻灯片
   */
  viewPhoto: function () {
    wx.previewImage({
      current: '',
      urls: this.data.slide_data.thumbnail_url
    })
  },

  /**
   * 拨打电话
   */
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  /**
   * 去评论
   */
  enterComment: function () {
    wx.navigateTo({
      url: '/page/benifit/pages/mall-comment/mall-comment'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  }

})