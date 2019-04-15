// banquet/pages/restaurant-time/index.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: [],
    week: '今天',
    checkDate: '',
    show: false,///日历展示 默认不显示
    pmMark: false,//午市标记
    eveningMark: false,//晚市标记
    pmTime: [
      { value: '11:00', checked: true },
      { value: '11:30', checked: false },
      { value: '12:00', checked: false },
      { value: '12:30', checked: false },
      { value: '13:00', checked: false },
      { value: '13:30', checked: false },
    ],
    eveningTime: [
      { value: '17:00', checked: false },
      { value: '17:30', checked: false },
      { value: '18:00', checked: false },
      { value: '18:30', checked: false },
      { value: '19:00', checked: false },
      { value: '19:30', checked: false },
      { value: '20:00', checked: false },
    ],
    showPmTime: true,
    showEveningTime: true,
    checkTime: '',//选择的时段断
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('pmTimeOri', this.data.pmTime);
    wx.setStorageSync('eveningTimeOri', this.data.eveningTime); //保存原始的午市和晚市时间段
    //获取往后15天的日期
    let dataList = this.getDates(15);
    dataList[0].week = '今天';
    dataList[1].week = '明天';
    //获取传入的日期和时间段
    let checkDate = options.checkDate
    let checkTime = options.checkTime  
    this.filterTimeSlot(checkDate);//过滤时间段,过去的时间段不显示

    var pm = this.data.pmTime;
    var evening =this.data.eveningTime;
    let curTime = util.getTime() //获取当前时间点 “12:00”
    //如果当前时间大于晚市，默认今天不显示
    if( curTime >=evening[evening.length-1].value){
      dataList.splice(0, 1);
    }
    
    var that = this 
    //默认选中 上一页传入的时段
    if (checkTime<evening[0].value) { 
      for (var i = 0; i < pm.length; ++i) {
        pm[i].checked = pm[i].value == checkTime
      }
      that.setData({
        pmMark:true,
        eveningMark:false,
        pmTime:pm
      })
    } else {
      for (var j = 0; j < evening.length; ++j) {
        evening[j].checked = evening[j].value == checkTime
      }
      that.setData({
        pmMark:false,
        eveningMark:true,
        eveningTime:evening
      })
    }
    that.setData({
      dateList: dataList,
      checkDate: checkDate,
      week:options.week,
      checkTime:checkTime,
      pmTime:that.data.pmTime,
      eveningTime:that.data.eveningTime
    })
  },
  // 过滤时间段
  filterTimeSlot: function (todate) {
    let curTime = util.getTime() //获取当前时间点 “12:00”
    let today = this.getCurrentMonthFirst();//今天
    let pm = wx.getStorageSync("pmTimeOri");
    let evening = wx.getStorageSync("eveningTimeOri");
    if (todate == today) { //如果选择的时间是今天 就要过滤时间段的显示     
      //小于午市
      if (curTime < pm[0].value) {
        this.setData({
          showPmTime: true,
          showEveningTime: true,
          checkTime: pm[0].value,
          pmTime:pm,
          eveningTime:evening
        })
      }
      //在午市之间
      if (curTime >= pm[0].value && curTime < pm[pm.length - 1].value) {
        var n = 0;
        for (let i = 0; i < pm.length; i++) {
          if (curTime >= pm[i].value) {
            n++;
          }
        }
        pm.splice(0, n)
        pm[0].checked = true
        this.setData({
          showPmTime: true,
          showEveningTime: true,
          pmTime: pm,
          eveningTime: evening,
          pmMark: true,
          eveningMark: false,
          checkTime: pm[0].value
        })
      }
      //大于午市小于晚市
      if (curTime >= pm[pm.length - 1].value && curTime < evening[0].value) {
        evening[0].checked = true
        this.setData({
          showPmTime: false,
          showEveningTime: true,
          pmTime: pm,
          eveningTime: evening,
          pmMark: false,
          eveningMark: true,
          checkTime: evening[0].value
        })
      }
      //在晚市之间
      if (curTime >= evening[0].value && curTime < evening[evening.length - 1].value) {
        var n = 0;
        for (let i = 0; i < evening.length; i++) {
          if (curTime >= evening[i].value) {
            n++;
          }
        }
        evening.splice(0, n)
        evening[0].checked = true
        this.setData({
          showPmTime: false,
          showEveningTime: true,
          pmTime: pm,
          eveningTime: evening,
          pmMark: false,
          eveningMark: true,
          checkTime: evening[0].value
        })
      }
      if( curTime >= evening[evening.length - 1].value){
        this.setData({
          showPmTime: false,
          showEveningTime: false,
          pmMark: false,
          eveningMark: false
        })
      }
    } else {   
      pm[0].checked =true
      //console.log(pm)
      this.setData({
        showPmTime: true,
        showEveningTime: true,
        pmTime: pm,
        eveningTime: evening,
        pmMark: true,
        eveningMark: false,
        checkTime: pm[0].value
      })
    }
  },
  /**
   * 获取当前时间多少天后的日期和对应星期
   * //todate默认参数是当前日期，可以传入对应时间
   */
  getDates: function (days, todate = this.getCurrentMonthFirst()) {
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
  dateLater: function (dates, later) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();//  获取星期
    dateObj.dates = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "月" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + "日";
    dateObj.newdates = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.year = date.getFullYear();
    dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.week = show_day[day];
    return dateObj;
  },
  //获取当前时间
  getCurrentMonthFirst: function () {
    var date = new Date();
    var todate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
    return todate;
  },
  /*获取下一天日期*/
  getNextDay:function(d){
    d = new Date(d);
    d = +d + 1000 * 60 * 60 * 24;
    d = new Date(d);
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var d = d.getDate();
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    return y + "-" + m + "-" + d;
  },
  onPressDate: function (e) {
    var { year, month, day, week } = e.currentTarget.dataset;
    var tempMonth = month;
    var tempDay = day;
    var date = year + "-" + tempMonth + "-" + tempDay;
    this.setData({
      checkDate: date,
      week: week,
    });
    this.filterTimeSlot(date);
  },
  showCalendar: function () {
    this.setData({
      show: true,
      checkDate: this.data.checkDate
    })
  },
  onSelect(e) {
    //console.log(e)
    let day = new Date(e.detail).getDay() //获取星期
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let weekDay = show_day[day];
    this.setData({
      checkDate: e.detail,
      week: weekDay,
    })
    this.filterTimeSlot(this.data.checkDate);
  },
  radioChangePm: function (e) {
    var items = this.data.pmTime;
    for (var i = 0; i < items.length; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }
    this.setData({
      pmTime: items,
      checkTime: e.detail.value,
      pmMark: true,
      eveningMark: false
    });
  },
  radioChangeEvening: function (e) {
    var items = this.data.eveningTime;
    for (var i = 0; i < items.length; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }
    this.setData({
      eveningTime: items,
      checkTime: e.detail.value,
      pmMark: false,
      eveningMark: true
    });
  },
  confirm: function () {
    var _this = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      checkDate: _this.data.checkDate,
      week: _this.data.week,
      checkTime: _this.data.checkTime
    })
    wx.navigateBack({
      delta: 1
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
})