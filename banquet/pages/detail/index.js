// banquet/pages/detail/index.js
const app = getApp();
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var wxParse = require('../../vendor/wxParse/wxParse.js');
var util = require("../../../utils/util.js");

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
    commerce_id: null, //商家id
    commerce_type: null, //商家类型type
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
  onLoad: function(options) {
    var that = this;
    that.setData({
      commerce_id: options.commerce_id //商家id
    })
    that.getDetailInfo(that.data.commerce_id);
  },

  /**
   * 获取商家详情
   */
  getDetailInfo(commerce_id) {
    var that = this;
    var slide_img = "slide_data.thumbnail_url";
    var imgCount = "slide_data.imgCount";
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/get_commerce_detail",
      params: {
        data: JSON.stringify({
          commerce_id: commerce_id
        })
      },
      success: res => {
        if(res.data.return_code == 'SUCCESS'){
          if(res.data.sub_code =='SUCCESS'){
            if (res.data.result) {
              if (res.data.result.details) {
                wxParse.wxParse('details', 'html', res.data.result.details, that, 5);
              }
              that.setData({
                commerceDetail: res.data.result,
                [slide_img]: res.data.result.thumbnail_url,
                //[imgCount]: res.data.result.thumbnail_url.length,
                latitude: res.data.result.latitude,
                longitude: res.data.result.longitude,
                commerce_type: res.data.result.type
              })
              wx.setNavigationBarTitle({
                title: res.data.result.commerce_name
              })
              if (that.data.commerce_type != 2) {
                that.onBusiness(res.data.result.business_hours);
              }
            }           
            that.getProtocol(commerce_id, that.data.commerce_type);
          }else if(res.data.sub_code =='COMMERCE_OFF_SHELF'){
            wx.showToast({
              icon: 'none',
              title: '该商家已下架',
              duration: 2000
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2500)
          }else{
            wx.showToast({
              icon: 'none',
              title: res.data.sub_msg,
              duration: 2000
            })
          }
        }
      }
    })
  },

  /**
   * 用来判断一个时间是不是在某个时间段内
   * beginTime 开始时间
   * endTime 结束时间
   */
  onBusiness(businessHours) {
    if (businessHours == null) {
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
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/get_commerce_discount",
      params: {
        data: JSON.stringify({
          commerce_id: commerce_id,
          type: typeid
        })
      },
      showLoading: false,
      success: res => {
        if(res.data.return_code == 'SUCCESS'){
          if (res.data.sub_code == 'SUCCESS'&&res.data.result) {
            if(typeid == 2){
              var data = res.data.result.hotel
              for (var i = 0; i < data.length; i++) {
                // data[i].deal_price_fen = String(data[i].deal_price_fen).split('');
                data[i].deal_price_fen = String(util.FenToYuan(data[i].deal_price_fen)).split('');
                data[i].store_price_fen = util.FenToYuan(data[i].store_price_fen);
                data[i].preferential_price = util.FenToYuan(data[i].preferential_price);
              }
            }else{
              var data = res.data.result.cate_or_entertainment
            }
            that.setData({
              protocolInfo: data
            })
          }
        }else{
          wx.showToast({
            icon: 'none',
            title: '服务器异常请重试',
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 酒店预定
   */
  hotelReserve: function(e) {
    var commerce_id = this.data.commerce_id;
    var hotel_room_id = e.currentTarget.dataset.id
    var price = ((e.currentTarget.dataset.price).toString()).replace(/,/g, "")
    var commerce_name = e.currentTarget.dataset.commercename;
    wx.navigateTo({
      url: '/banquet/pages/hotel-reserve/index?commerce_id=' + commerce_id + '&commerce_name=' + commerce_name + '&hotel_room_id=' + hotel_room_id + '&price=' +
        price + '&store_price=' + e.currentTarget.dataset.storeprice,
    })
  },
  restaurantReserve: function(e) {
    var commerce_id = this.data.commerce_id;
    var commerce_name = e.currentTarget.dataset.commercename;
    wx.navigateTo({
      url: '/banquet/pages/restaurant-reserve/index?commerce_id=' + commerce_id+ '&commerce_name=' + commerce_name,
    })
  },
  /**
   * 查看幻灯片
   */
  viewPhoto: function(e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.slide_data.thumbnail_url[index],
      urls: this.data.slide_data.thumbnail_url
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

  openMap: function() {
    let latitude =  Number(this.data.latitude)
    let longitude =  Number(this.data.longitude)
    if(latitude==0 || longitude == 0){
      return false
    }else{
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        scale: 28,
        name:this.data.commerceDetail.commerce_name,
        address:this.data.commerceDetail.address,
      })
    } 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //this.getComments(this.data.commerce_id);
  }

})