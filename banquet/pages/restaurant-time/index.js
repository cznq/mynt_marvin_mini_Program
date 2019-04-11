// banquet/pages/restaurant-time/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList: [],
    checkId:'',
    week:'',
    checkDate:'',
    pmMark:false,//午市标记
    eveningMark:false,//晚市标记
    pmTime:[
      { value: '12:00', id: '1', checked: true },
      { value: '12:30', id: '2', checked: false },
      { value: '13:00', id: '3', checked: false },
      { value: '13:30', id: '4' , checked: false},
    ],
    eveningTime:[
      { value: '17:00', id: '5', checked: false },
      { value: '17:30', id: '6', checked: false},
      { value: '18:00', id: '7', checked: false },
      { value: '18:30', id: '8', checked: false},
      { value: '19:00', id: '9', checked: false },
      { value: '19:30', id: '10', checked: false },
      { value: '20:00', id: '11', checked: false },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let dataList = this.getDates(15);//获取往后15天的日期
    dataList[0].week ='今天'
    dataList[1].week ='明天'
    this.setData({
      dateList: dataList
    })
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
  },
  onSelect(e) { 
    //console.log(e)
    let day = new Date(e.detail).getDay() //获取星期
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    this.setData({
      checkDate: e.detail,
      week:show_day[day]
    })
  },
  radioChangeTime:function(e){
    var items = this.data.pmTime;
    for (var i = 0; i < items.length; ++i) {
      items[i].checked = items[i].id == e.detail.value
    }
    console.log(items)
    this.setData({
      pmTime: items
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