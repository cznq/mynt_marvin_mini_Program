// components/calendarMoel/index.js
var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear(); //当前年份
var DATE_MONTH = new Date().getMonth() + 1; //当天月份
var DATE_DAY = new Date().getDate(); //当天日期
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Array,
      value: []
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    weekStr: ["日", "一", "二", "三", "四", "五", "六"],
    maxMonth: 12,
    dateList: [],
    today: DATE_YEAR + "-" + DATE_MONTH + "-" + DATE_DAY,
    currMonth: [], //当前显示月份
    systemInfo: {},
    show: false,
    n: "0",
    markData: false //选择标记
  },
  /**
   * 组件的方法列表
   */
  // ready: function() {
  //   //this.createDateListData();
  // },
  methods: {
    createDateListData: function() {
      var dateList = [];
      var now = new Date();
      /*
        设置日期为 年-月-01,否则可能会出现跨月的问题
        比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
          原因是由于2月份没有31号，顺推下去变成了了03-03
      */
      now = new Date(now.getFullYear(), now.getMonth(), 1);
      for (var i = 0; i < this.data.maxMonth; i++) {
        var momentDate = Moment(now).add(
          this.data.maxMonth - (this.data.maxMonth - i),
          "month"
        ).date;
        var year = momentDate.getFullYear();
        var month = momentDate.getMonth() + 1;

        var days = [];
        var totalDay = this.getTotalDayByMonth(year, month);
        var week = this.getWeek(year, month, 1);
        //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
        //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
        for (var j = -week + 1; j <= totalDay; j++) {
          var tempWeek = -1;
          if (j > 0) tempWeek = this.getWeek(year, month, j);
          var clazz = "";
          if (tempWeek == 0 || tempWeek == 6) clazz = "week";
          if (j < DATE_DAY && year == DATE_YEAR && month == DATE_MONTH)
            //当天之前的日期不可用
            clazz = "unavailable " + clazz;
          else clazz = "" + clazz;
          days.push({ day: j, class: clazz });
        }
        var dateItem = {
          id: year + "-" + month,
          year: year,
          month: month,
          days: days
        };
        dateList.push(dateItem);
      }
      return dateList;
    },
    /*
     * 获取月的总天数
     */
    getTotalDayByMonth: function(year, month) {
      month = parseInt(month, 10);
      var d = new Date(year, month, 0);
      return d.getDate();
    },
    /*
     * 获取月的第一天是星期几
     */
    getWeek: function(year, month, day) {
      var d = new Date(year, month - 1, day);
      return d.getDay();
    },
    handleCalendar: function(e) {
      var _this = this;
      const handle = e.currentTarget.dataset.handle;
      let n = _this.data.n;
      if (handle === "prev") {
        if (n == 0) {
          return false;
        } else {
          n--;
          _this.setData({
            currMonth: _this.data.dateList[n],
            n: n
          });
        }
      } else if (handle === "next") {
        if (n < _this.data.dateList.length - 1) {
          n++;
          _this.setData({
            currMonth: _this.data.dateList[n],
            n: n
          });
        } else {
          return false;
        }
      }
    },
    changeDate: function(e) {
      var { year, month, day } = e.currentTarget.dataset;
      //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
      if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0) return;
      var tempMonth = month;
      var tempDay = day;

      if (month < 10) tempMonth = "0" + month;
      if (day < 10) tempDay = "0" + day;

      var date = year + "-" + tempMonth + "-" + tempDay;
      if (this.data.markData || this.data.selectData === date) {
        this.setData({
          markData: false,
          dateList: this.createDateListData()
        });
      }
      if (!this.data.markData) {
        this.setData({
          selectData: date,
          markData: true,
          dateList: this.createDateListData()
        });
      }

      this.renderPressStyle(year, month, day);
    },
    renderPressStyle: function(year, month, day) {
      var dateList = this.data.dateList;
      //渲染点击样式
      for (var i = 0; i < dateList.length; i++) {
        var dateItem = dateList[i];
        var id = dateItem.id;
        if (id === year + "-" + month) {
          var days = dateItem.days;
          for (var j = 0; j < days.length; j++) {
            var tempDay = days[j].day;
            if (tempDay == day) {
              days[j].class = days[j].class + " active";
              break;
            }
          }
          break;
        }
      }
      this.setData({
        dateList: dateList,
        currMonth: dateList[this.data.n]
      });
    },
    //初始化选择器信息
    toggleSelect:function(){
      let show = this.data.show
      if (show) return this.setData({ show: !show })
      this.setData({
        dateList: this.createDateListData()
      });
      var _this = this;
      wx.getSystemInfo({
        success: function(res) {
          _this.setData({
            systemInfo: res,
            currMonth: _this.data.dateList[0],
            show: !show
          });
        }
      });
    },
    //关闭弹窗
    // 取消
    hideCalendar() {
      this.setData({ show: false });
    },
    //确定
    submitCalendar: function() {
      this.setData({
        show: false,
      },
        ()=>{       
          const result=this.data.selectData
          this.triggerEvent('select', result)
        }
      );
    }
  }
});
