// pages/mall-home/mall-home.js
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
    tabSelected: 'food',
    selectedType: 0,
    tabList: [{
      typeid: 0,
      id: 'food',
      title: '美食'
    },
    {
      typeid: 1,
      id: 'entertainment',
      title: '娱乐'
    },
    {
      typeid: 2,
      id: 'hotel',
      title: '酒店'
    },
      {
        typeid: 3,
        id: 'business',
        title: '商务宴请'
      }
    ],
    tabFixed: false,
    showVipCardTips: true,
    is_vip: false,
    employeeInfo: null,
    taboffsetTop: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.tabSelected && options.selectedType) {
      this.setData({ tabSelected: options.tabSelected, selectedType: options.selectedType });
    }
    var self = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        self.getCommerceList(self.data.selectedType);
        self.getEmployeeInfo();
      })
    } else {
      self.getCommerceList(self.data.selectedType);
      self.getEmployeeInfo();
    }
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
      console.log(res[0].top);
      that.setData({
        taboffsetTop: res[0].top
      })
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
   * 头部轮播图跳转
   */
  linkRedirect: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link,
    })
  },

  /**
   * 点击VIP卡片
   */
  backVipCard() {
    wx.navigateTo({
      url: '/benifit/pages/vip-card/vip-card'
    })
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
          type: commerceType
        })
      },
      success: res => {
        if (res.data.sub_code == 0 && res.data.result) {
          if (commerceType == 2) {
            that.setData({
              shopList: that.transData(res.data.result),
              [slide_img]: res.data.result.hompage
            })
          } else {
            that.setData({
              shopList: res.data.result,
              [slide_img]: res.data.result.hompage
            })
          }
        } else {
          that.setData({
            shopList: null
          })  
        }
      }
    })
  },

  transData(preData) {
    for (var i = 0; i < preData.length; i++) {
      preData[i].agreement_price = String(preData[i].agreement_price).split('');
    }
    return preData;
  },

  /**
 * 跳转到商家详情
 */
  redirectCommerce: function (e) {
    var commerce_id = e.currentTarget.dataset.commerceid;
    var commerce_type = e.currentTarget.dataset.commercetype;
    wx.navigateTo({
      url: '/benifit/pages/mall-detail/mall-detail?commerce_id=' + commerce_id + '&commerce_type=' + commerce_type,
    })
  },

  /**
   * 检测是否第一次进来
   */
  checkShowTip() {
    var flag = wx.getStorageSync('firstComeIn');
    //console.log(flag);
    if (flag) {
      this.setData({
        showVipCardTips: false
      });
    }
    
  },

  onReady: function () {
    wx.setStorage({
      key: 'firstComeIn',
      data: 'true'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkShowTip();
  },

})