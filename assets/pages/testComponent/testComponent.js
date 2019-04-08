// assets/pages/testComponent/testComponent.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectData: '请选择预定时间',
    dateList: [],
    checkId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let dataList = this.getDates(15); //获取往后15甜的日期
    dataList[0].week = '今天'
    dataList[1].week = '明天'
    var time = util.formatTime(new Date())
    this.setData({
      time: time,
      dateList: dataList
    })
    console.log(this.data.dateList)
  },
  /**
   * 获取d当前时间多少天后的日期和对应星期
   * //todate默认参数是当前日期，可以传入对应时间
   */
  getDates: function(days, todate = this.getCurrentMonthFirst()) {
    var dateArry = [];
    for (var i = 0; i < days; i++) {
      var dateObj = this.dateLater(todate, i);
      dateArry.push(dateObj);
    }
    return dateArry;
  },
  /**
   * 传入时间后几天
   * param：传入时间：dates:"2018-04-02",later:往后多少天
   */
  dateLater: function(dates, later) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay(); //  获取星期
    dateObj.dates = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "月" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + "日";
    dateObj.newdates = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.year = date.getFullYear();
    dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.week = show_day[day];
    return dateObj;
  },
  //获取当前时间
  getCurrentMonthFirst: function() {
    var date = new Date();
    var todate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1) +
      "-" +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    return todate;
  },
  onPressDate: function(e) {
    var {
      year,
      month,
      day,
      id
    } = e.currentTarget.dataset;
    var tempMonth = month;
    var tempDay = day;
    var date = year + "-" + tempMonth + "-" + tempDay;
    this.setData({
      checkId: id,
      checkDate: date
    });

  },
  onSelect(e) {
    console.log(e)
    this.setData({
      selectData: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})