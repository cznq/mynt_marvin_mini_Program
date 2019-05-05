// banquet/pages/banquet-home/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slide_data: {
      slide_img: {},
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 500
    },
    shopList: null,
    tabSelected: 'hotel',
    selectedType: 2,
    tabList: [{
      typeid: 2,
      id: 'hotel',
      title: '酒店'
    },
    {
      typeid: 0,
      id: 'business',
      title: '宴请'
    },
    ],
    tabFixed: false,
    is_vip: false,
    employeeInfo: null,
    taboffsetTop: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tabSelected && options.selectedType) {
      this.setData({ tabSelected: options.tabSelected, selectedType: options.selectedType });
    }
    this.setData({ benifit_type: options.benifit_type });
    var self = this;

    self.getCommerceList(self.data.selectedType);
    self.getOffsetTop();
  },

  /**
   * 获取tab 距离上面的距离
   */
  getOffsetTop() {
    var that = this;
    const query = wx.createSelectorQuery()
    query.select('#selTab').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res[0]);
      that.setData({
        taboffsetTop: res[0].top
      })
    })
  },
  /**
   * 监听滚动，tab置顶
   */
  onPageScroll: function (e) {
    console.log(e.scrollTop);
    var that = this;
    if (e.scrollTop < that.data.taboffsetTop) {
      that.setData({
        tabFixed: false
      });
    } else {
      that.setData({
        tabFixed: true
      });
    }
  },

  /**
   * 切换Tab
   */
  changeTab: function (e) {
    var typedId = e.currentTarget.dataset.typeid;
    var selectedId = e.currentTarget.dataset.selectid;
    this.setData({ tabSelected: selectedId, selectedType: typedId });
    this.getCommerceList(typedId);
  },


  /**
   * 获取首页的商家列表
   */
  getCommerceList(commerceType) {
    var that = this;
    var slide_img = "slide_data.slide_img";
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'commerce',
        method: 'get_commerce_list',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          benifit_type:that.data.benifit_type,
          type: commerceType
        })
      },
      success: res => {
        if(res.data.sub_code == 0){
          if(res.data.result){
            if(res.data.result.hompage !=''){
              that.setData({
                [slide_img]: res.data.result.hompage
              })
            }else{
              that.setData({
                [slide_img]: [{homepage_url:"https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/banquet/default%402x.png",link_url: "/pages/businessService/suite-introduce/suite-introduce"}]
              })
            }
            if(res.data.result.commerces){
              that.setData({
                shopList: res.data.result.commerces
              })
            }else{
              that.setData({
                shopList: null
              })
            }
          }
        }
      }
    })
  },

  /**
   * 跳转到商家详情
   */
  redirectCommerce: function (e) {
    var commerce_id = e.currentTarget.dataset.commerceid;
    var commerce_type = e.currentTarget.dataset.commercetype;
    wx.navigateTo({
      url: '/banquet/pages/detail/index?commerce_id=' + commerce_id,
    })
  },
  /**
   * 头部轮播图跳转
   */
  linkRedirect: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link,
    })
  },
  orderList:function(){
    wx.navigateTo({
      url: '/banquet/pages/order/order',
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

})