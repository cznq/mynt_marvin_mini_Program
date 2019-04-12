// banquet/pages/restaurant-time/index.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: [],
    checkId:0,
    week:'今天',
    checkDate: '',
    pmMark:true,//午市标记
    eveningMark:false,//晚市标记
    pmTime:[
      { value: '11:00', checked: true },
      { value: '11:30', checked: false },
      { value: '12:00', checked: false },
      { value: '12:30', checked: false },
      { value: '13:00', checked: false },
      { value: '13:30', checked: false},
    ],
    eveningTime:[
      { value: '17:00', checked: false },
      { value: '17:30', checked: false},
      { value: '18:00', checked: false },
      { value: '18:30', checked: false},
      { value: '19:00', checked: false },
      { value: '19:30', checked: false },
      { value: '20:00', checked: false },
    ],
    calendarShow:false,
    showPmTime:true,
    showEveningTime:true,
    checkTime:'',//选择的时段断
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let dataList = this.getDates(15);//获取往后15天的日期
    dataList[0].week ='今天';
    dataList[1].week ='明天';
    this.setData({
      dateList: dataList,
      checkDate:this.getCurrentMonthFirst() //初始化默认选择时间为当前时间
    })
    this.filterTimeSlot(this.data.checkDate);
  },
  // 过滤时间段
  filterTimeSlot:function(todate) {
    let curTime = util.getTime() //获取当前时间点 “12:00”
    let today = this.getCurrentMonthFirst();
    let pm = this.data.pmTime;
    let evening = this.data.eveningTime;
    if(todate == today){ //如果选择的时间是今天 就要过滤时间段的显示
      //是否超过午市最大时间段
      if (curTime > pm[pm.length-1].value) {
        this.setData({
          showPmTime: false,
          showEveningTime:true
        })
      } else {
        
      } 
    }else{
      this.setData({
        showPmTime: true,
        showEveningTime:true
      })
    }
  },
  /**
   * 获取当前时间多少天后的日期和对应星期
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
  dateLater:function(dates,later){
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
  getCurrentMonthFirst: function() {
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
  onPressDate:function(e){
    var { year, month, day,week,id } = e.currentTarget.dataset;
    var tempMonth = month;
    var tempDay = day;
    var date = year + "-" + tempMonth + "-" + tempDay;
    this.setData({
      checkId: id,
      checkDate:date,
      week:week,
    });
    this.filterTimeSlot(date);
  },
  onSelect(e) { 
    //console.log(e)
    let day = new Date(e.detail).getDay() //获取星期
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let weekDay = show_day[day];
    this.setData({
      checkDate: e.detail,
      week:weekDay
    })
  },
  showCalendar:function(){
    this.setData({
      calendarShow:true
    })
  },
  radioChangePm:function(e){
    var items = this.data.pmTime;
    for (var i = 0; i < items.length; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }
    this.setData({
      pmTime: items,
      checkTime:e.detail.value,
      pmMark:true,
      eveningMark:false
    });
  },
  radioChangeEvening:function(e){
    var items = this.data.eveningTime;
    for (var i = 0; i < items.length; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }
    this.setData({
      eveningTime: items,
      checkTime:e.detail.value,
      pmMark:false,
      eveningMark:true
    });
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