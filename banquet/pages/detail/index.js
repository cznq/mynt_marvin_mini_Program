// banquet/pages/detail/index.js
const app = getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var wxParse = require('../../vendor/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    slide_data: {
      thumbnail_url: [],
      imgCount: 0,
      indicatorDots: false,
      autoplay: false,
      interval: 20000,
      duration: 300
    },
    is_vip: false,
    commerce_id: null,
    commerce_type: null,
    commerceDetail: null,
    employeeInfo: null,
    protocolInfo: null,
    commentList: null,
    businessStatus: "",
    latitude: null,
    longitude: null
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
    that.getDetailInfo(that.data.commerce_id);
    that.getEmployeeInfo();
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
      showLoading: false,
      success: res => {
        if (res.data.result) {
          that.setData({
            employeeInfo: res.data.result
          })
          app.Util.network.POST({
            url: app.globalData.BENIFIT_API_URL,
            params: {
              service: 'company',
              method: 'get_company_service_status',
              data: JSON.stringify({
                union_id: wx.getStorageSync('xy_session'),
                service_key: 'EMPLOYEE_BENIFIT'
              })
            },
            showLoading: false,
            success: res => {
              if (res.data.result.service_status !== 0) {
                that.setData({
                  is_vip: true
                })
              }
            }
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
    var imgCount = "slide_data.imgCount";
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
        if (res.data.result) {
          if (res.data.result.details) {
            wxParse.wxParse('details', 'html', res.data.result.details, that, 5);
          }
          that.setData({
            commerceDetail: res.data.result,
            [slide_img]: res.data.result.thumbnail_url,
            [imgCount]: res.data.result.thumbnail_url.length,
            latitude: res.data.result.latitude,
            longitude: res.data.result.longitude
          })
          wx.setNavigationBarTitle({
            title: res.data.result.name
          })
         if(that.data.commerce_type != 2){
          that.onBusiness(res.data.result.business_hours);
         }
        }
        that.getProtocol(commerce_id, that.data.commerce_type);
        that.getComments(commerce_id);
        //app.Util.generateMap(this, res.data.result.address);
      }
    })
  },

  /**
   * 用来判断一个时间是不是在某个时间段内
   * beginTime 开始时间 
   * endTime 结束时间 
   */
  onBusiness(businessHours) {
    if (businessHours.length == 1 && businessHours[0] == null) {
      this.setData({
        businessStatus: "营业中"
      })
      return;
    }
    for (var i = 0; i < businessHours.length; i++) {
      var hour = new Date().getHours();
      var min = new Date().getMinutes();

      var varTime = hour + ':' + min;

      var strb = businessHours[i].start.split(":");
      if (strb.length != 2) {
        return false;
      }
      var stre = businessHours[i].end.split(":");
      if (stre.length != 2) {
        return false;
      }
      var strv = varTime.split(":");
      if (strv.length != 2) {
        return false;
      }
      var b = new Date();
      var e = new Date();
      var v = new Date();
      b.setHours(strb[0]);
      b.setMinutes(strb[1]);
      e.setHours(stre[0]);
      e.setMinutes(stre[1]);
      v.setHours(strv[0]);
      v.setMinutes(strv[1]);

      if ((v.getTime() - b.getTime() >= 0 && (e.getTime() - v.getTime()) >= 0)) {
        this.setData({
          businessStatus: "营业中"
        })
        return false;
      } else {
        this.setData({
          businessStatus: "已歇业"
        })
      }
    }

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
      showLoading: false,
      success: res => {
        if (res.data.result) {
          var data = res.data.result;
          delete data.discount_tag
          for (var i = 0; i < data.length; i++) {
            data[i].deal_price_fen = String(data[i].deal_price_fen).split('');
          }
          that.setData({
            protocolInfo: data
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
      showLoading: false,
      success: res => {
        if (res.data.result) {
          that.setData({
            commentList: res.data.result
          })
        }
      }
    })
  },

  /**
   * 酒店预定
   */
  hotelReserve:function(e){
    var commerce_id = this.data.commerce_id;
    var hotel_room_id = e.currentTarget.dataset.id
    var price = ((e.currentTarget.dataset.price).toString()).replace(/,/g, "")
    wx.navigateTo({
      url: '/banquet/pages/hotel-reserve/index?commerce_id=' + commerce_id + '&hotel_room_id=' + hotel_room_id+ '&price=' + 
      price+ '&store_price=' + e.currentTarget.dataset.storeprice,
    })
  },
  restaurantReserve:function(){
    var commerce_id = this.data.commerce_id;
    wx.navigateTo({
      url: '/banquet/pages/restaurant-reserve/index?commerce_id=' + commerce_id,
    })
  },
  /**
   * 查看幻灯片
   */
  viewPhoto: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.slide_data.thumbnail_url[index],
      urls: this.data.slide_data.thumbnail_url
    })
  },

  // 全屏查看评论图
  previewImage(e) {
    var pindex = e.currentTarget.dataset.pindex;
    var mindex = e.currentTarget.dataset.mindex;
    //console.log(this.data.commentList);
    wx.previewImage({
      current: this.data.commentList[mindex].pic_url[pindex],
      urls: this.data.commentList[mindex].pic_url
    })
  },

  // 查看房型缩略图
  previewHotelImage(e) {
    var pindex = e.currentTarget.dataset.pindex;
    var row = e.currentTarget.dataset.rowid;
    wx.previewImage({
      current: this.data.protocolInfo[row].thumbnail_url[pindex],
      urls: this.data.protocolInfo[row].thumbnail_url
    })
  },

  /**
   * 打开地图服务
   */

  openMap: function () {
    wx.openLocation({
      latitude: parseFloat(this.data.latitude),
      longitude: parseFloat(this.data.longitude),
      scale: 28
    })
  },

  /**
   * 去评论
   */
  enterComment: function (e) {
    if (this.data.is_vip) {
      var commerce_id = e.currentTarget.dataset.commerceid;
      wx.navigateTo({
        url: '/benifit/pages/mall-comment/mall-comment?commerce_id=' + commerce_id
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '你还不是VIP，不能评论'
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getComments(this.data.commerce_id);
  }

})