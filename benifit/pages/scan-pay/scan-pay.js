// pages/scan-pay/scan-pay.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_vip: false,
    showVipCard: false,
    dialog_discount: null,
    dialog_discount_limit: null,
    cd_CommerceInfo: null,
    cd_CommerceDiscount: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var commerce_id = options.commerce_id;
    var type = options.type;
    if (type != 0 && type != 1) {
      wx.navigateTo({
        url: '/benifit/pages/mall-detail/mall-detail?commerce_id=' + commerce_id + '&commerce_type=' + type
      });
      return false;
    }
    that.getEmployeeInfo();
    that.getCommerceInfo(commerce_id);
    that.getCommerceDiscount(commerce_id, type);
  },
  /**
   * 获取指定商家信息
   */
  getCommerceInfo(commerce_id) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'commerce',
        method: 'get_commerce_info',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          "commerce_id": commerce_id
        })
      },
      success: res => {
        console.log(res);
        that.setData({
          cd_CommerceInfo: res.data.result
        })
      }
    })
  },
  /**
   * 获取商家协议优惠
   */
  getCommerceDiscount(commerce_id, type) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'commerce',
        method: 'get_commerce_discount',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          "commerce_id": commerce_id,
          "type": type
        })
      },
      success: res => {
        console.log(res);
        that.setData({
          cd_CommerceDiscount: res.data.result
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
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_company_service_status',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          service_key: 'EMPLOYEE_BENIFIT'
        })
      },
      success: res => {
        console.log(res);
        if (res.data.result.service_status !== 0) {
          console.log('kaitong');
          app.Util.network.POST({
            url: app.globalData.BENIFIT_API_URL,
            params: {
              service: 'company',
              method: 'get_employee_info',
              union_id: wx.getStorageSync('xy_session'),
              data: JSON.stringify({})
            },
            success: res => {
              console.log(res);
              if (res.data.result) {
                that.setData({
                  is_vip: true
                })
                wx.setBackgroundColor({
                  backgroundColor: '#404452', // 窗口的背景色为白色
                })
                wx.setNavigationBarColor({
                  frontColor: '#ffffff',
                  backgroundColor: '#404452'
                })
                that.setData({
                  employeeInfo: res.data.result
                })
              } else {
                that.setData({
                  is_vip: false
                })
              }
            }
          })
        } else {
          that.setData({
            is_vip: false
          })
        }
      }
    })
  },
  /**
   * 关闭VIP卡弹窗
   */
  closeDialog: function() {
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
  cardTopay: function(e) {
    if (this.data.is_vip == false) {
      wx.navigateTo({
        url: '/benifit/pages/vip-card/vip-card'
      })
      return;
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
  viewPhoto: function(e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.slide_data.thumbnail_url[index],
      urls: this.data.slide_data.thumbnail_url
    })
  },
})