// assets/home/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    application:[{
      bindtap:'',
      name:'资产管理',
      pic:app.globalData.BASE_IMG_URl +'assets/homepage_asset_management%402x.png',
      isShow:true
    },
    {
      bindtap:'',
      name:'收款核销',
      pic:app.globalData.BASE_IMG_URl +'assets/homepage_receivables%402x.png',
      isShow:true
    },
    {
      bindtap:'',
      name:'新增收款',
      pic:app.globalData.BASE_IMG_URl +'assets/homepage_add_receipts%402x.png',
      isShow:true
    },
    {
      bindtap:'',
      name:'对账',
      pic:app.globalData.BASE_IMG_URl +'assets/homepage_reconciliation%402x.png',
      isShow:true
    },
    {
      bindtap:'',
      name:'人员管理',
      pic:app.globalData.BASE_IMG_URl +'assets/homepage_man_management%402x.png',
      isShow:true
    }],
    assets:'',//资产统计
    hasAssets:false,
    payable:false,//收款项
    noneData: {
      buttonText: '创建资产',
      textInfo: '暂无资产，请先创建楼宇',
      btnFunc:'creatAsset',
      icon:'no_asset',
      pic:app.globalData.BASE_IMG_URl +'assets/empty_no_asset%402x.png',
      picSize:{
        width:180+'rpx',
        height:144+'rpx',
        marginTop: 450+'rpx'
      }
    },
    noPay:{
      textInfo: '暂无逾期收款',
      pic:app.globalData.BASE_IMG_URl +'assets/empty_overdue_receivable%402x.png',
      icon:'no_receipt',
      picSize:{
        width:162+'rpx',
        height:128+'rpx',
        marginTop:184+'rpx'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.Util.networkUrl.postUrl({
      url: app.globalData.BASE_ASSET_URL+'/employee/get/union_id',
      params: {
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        //if (res.data.sub_code == 0 && res.data.result) {
          var employee_id = res.data.result.employee_id;//职员id
          var owner_id= res.data.result.owner_id;//房东id
          //获取资产汇总信息
          app.Util.networkUrl.postUrl({
            url: app.globalData.BASE_ASSET_URL+'/asset/summary',
            params: {
              data: JSON.stringify({
                owner_id: 1,
                employee_id:1
              })
            },
            success: res => {
              if (res.data.result) {
                _this.setData({
                  hasAssets: true,
                  assets:res.data.result
                })
              }
            }
          })
        //}
      }
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