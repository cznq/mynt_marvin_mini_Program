// assets/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    application:[{
      bindtap:'',
      name:'资产管理',
      pic:'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/homepage_asset_management%402x.png',
      isShow:true
    },
    {
      bindtap:'',
      name:'收款核销',
      pic:'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/homepage_receivables%402x.png',
      isShow:true
    },
    {
      bindtap:'',
      name:'新增收款',
      pic:'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/homepage_add_receipts%402x.png',
      isShow:true
    },
    {
      bindtap:'',
      name:'对账',
      pic:'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/homepage_reconciliation%402x.png',
      isShow:true
    },
    {
      bindtap:'',
      name:'人员管理',
      pic:'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/homepage_man_management%402x.png',
      isShow:true
    }],
    hasAssets:true,
    payable:true,
    noneData: {
      buttonText: '创建资产',
      textInfo: '暂无资产，请先创建楼宇',
      btnFunc:'creatAsset',
      icon:'no_asset',
      pic:'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/empty_no_asset%402x.png'
    },
    noPay:{
      textInfo: '暂无逾期收款',
      pic:'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/assets/empty_overdue_receivable%402x.png',
      icon:'no_receipt'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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