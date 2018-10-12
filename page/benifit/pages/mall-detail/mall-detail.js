// pages/mall-detail/mall-detail.js
const app = getApp();
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
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
      duration: 1000
    },
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
    dialog_discount_limit: null,
    systemInfo: null,
    viewID: "discSec",
    businessStatus: null
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
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res
        })
      }
    })
  
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
              is_vip: true,
              employeeInfo: res.data.result
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
        wxParse.wxParse('details', 'html', res.data.result.details, that, 5);
        if (res.data.result) {
          that.setData({
            commerceDetail: res.data.result,
            [slide_img]: res.data.result.thumbnail_url,
            [imgCount]: res.data.result.thumbnail_url.length
          })
          wx.setNavigationBarTitle({
            title: res.data.result.name
          })
          that.onBusiness(res.data.result.business_hours.start, res.data.result.business_hours.end);
        }
        that.getProtocol(commerce_id, that.data.commerce_type);
        that.getComments(commerce_id);
      }
    })
  },
  
  /**
  * 用来判断一个时间是不是在某个时间段内
  * beginTime 开始时间 
  * endTime 结束时间 
  */
  onBusiness(beginTime, endTime) {
    var hour = new Date().getHours();
    var min = new Date().getMinutes();

    var varTime = hour + ':' + min;
    
    var strb = beginTime.split(":");
    if (strb.length != 2) {
      return false;
    }
    var stre = endTime.split(":");
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
    } else {
      this.setData({
        businessStatus: "已歇业"
      })
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
      success: res => {
        if (res.data.result) {
          var data = res.data.result;
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
      success: res => {
        if (res.data.result) {
          that.setData({
            commentList: res.data.result
          })
        }
      }
    })
  },

  gotoView: function(e) {
    this.setData({
      viewID: e.currentTarget.dataset.partid
    })
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
    if (this.data.is_vip == false) {
      wx.navigateTo({
        url: '/page/benifit/pages/vip-card/vip-card'
      })
      return ;
    }
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
    console.log(this.data.commentList);
    wx.previewImage({
      current: this.data.commentList[mindex].pic_url[pindex],
      urls: this.data.commentList[mindex].pic_url
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
   * 打开地图服务
   */
  generateMap: function () {
    var that = this;
    var qqmapsdk = new QQMapWX({
      key: 'CGVBZ-S2KHV-3CBPC-UP4JI-4N55F-7VBFU'
    });
    qqmapsdk.geocoder({
      address: this.data.commerceDetail.address,
      success: function (res) {
        if (res.result.location) {
          wx.openLocation({
            latitude: res.result.location.lat,
            longitude: res.result.location.lng,
            scale: 28
          })
        } else {
          wx.showToast({
            title: '获取经纬度失败'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '获取经纬度失败'
        })
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },

  /**
   * 去评论
   */
  enterComment: function (e) {
    if (this.data.is_vip) {
      var commerce_id = e.currentTarget.dataset.commerceid;
      wx.navigateTo({
        url: '/page/benifit/pages/mall-comment/mall-comment?commerce_id=' + commerce_id
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