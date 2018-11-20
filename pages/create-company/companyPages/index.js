// pages/create-company/companyPages/index.js
var app = getApp();
Page({
  data: {
    CstateCode: 1,
    cd:{},
    button_text:'编辑企业信息'
  },
  onLoad: function (options) {
    var _this = this;
    _this.data.CstateCode = options.CstateCode;
    if (options.CstateCode == 1) {
      wx.setNavigationBarTitle({
        title: '创建公司'
      })
    } else if (options.CstateCode == 2) {
      wx.setNavigationBarTitle({
        title: '编辑企业信息'
      })
    }
    //请求
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session') 
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code == 0) {
          // res.data.result.address = '';
          // res.data.result.background_url = '';
          res.data.result.introduction = 'MYNTAI（小觅智能）2014年7月成立于美国硅谷，专注立体视觉技术整体解决方案，是行业领先的视觉定位导航VPS核心技';
          // res.data.result.product_urls = [""];
          // res.data.result.floor = '';
          // res.data.result.room = '';
          // res.data.result.phone = '';
          // res.data.result.website = '';

          //简介展开
          if (res.data.result.introduction.length>=68){
            res.data.result.introductionAll = res.data.result.introduction;
            res.data.result.introduction = res.data.result.introduction.substr(0,68)+'...';
            res.data.result.introductionAll_button = true;
          }
          _this.setData({
            cd: res.data.result
          })
        } else {
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })

  },
  robotPreview:function(){
    wx.navigateTo({
      url: '../robotPreview/index',
    })
  },
  introductionAll:function(){
    var _this = this;
    _this.setData({
      'cd.introductionAll_button': false,
      'cd.introduction': _this.data.cd.introductionAll
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})