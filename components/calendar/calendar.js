var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();//当前年份
var DATE_MONTH = new Date().getMonth() + 1; //当天月份
var DATE_DAY = new Date().getDate(); //当天日期
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    /**
   * 组件的初始数据
   */
    data: {
        weekStr: ['日', '一', '二', '三', '四', '五', '六'],
        maxMonth: 7, //最多渲染月数
        dateList: [],
        checkInDate: '',
        checkOutDate: '',
        markcheckInDate: false, //标记开始时间是否已经选择
        markcheckOutDate: false,   //标记结束时间是否已经选择
        stayDays: '0',
        today: DATE_YEAR + '-' + DATE_MONTH + '-' + DATE_DAY
    },
    /**
     * 组件的方法列表
     */
    ready: function () {
        this.createDateListData();
        console.log(this.data.today)
    },
    methods: {
        createDateListData: function () {
            var dateList = [];
            var now = new Date();
            /*
              设置日期为 年-月-01,否则可能会出现跨月的问题
              比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
                原因是由于2月份没有31号，顺推下去变成了03-03
            */
            now = new Date(now.getFullYear(), now.getMonth(), 1);
            for (var i = 0; i < this.data.maxMonth; i++) {
                var momentDate = Moment(now).add(this.data.maxMonth - (this.data.maxMonth - i), 'month').date;
                var year = momentDate.getFullYear();
                var month = momentDate.getMonth() + 1;

                var days = [];
                var totalDay = this.getTotalDayByMonth(year, month);
                var week = this.getWeek(year, month, 1);
                //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
                //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
                for (var j = -week + 1; j <= totalDay; j++) {
                    var tempWeek = -1;
                    if (j > 0)
                        tempWeek = this.getWeek(year, month, j);
                    var clazz = '';
                    if (tempWeek == 0 || tempWeek == 6)
                        clazz = 'week'
                    if (j < DATE_DAY && year == DATE_YEAR && month == DATE_MONTH)
                        //当天之前的日期不可用
                        clazz = 'unavailable ' + clazz;
                    else
                        clazz = '' + clazz
                    days.push({ day: j, class: clazz })
                }
                var dateItem = {
                    id: year + '-' + month,
                    year: year,
                    month: month,
                    days: days
                }

                dateList.push(dateItem);
            }

            this.setData({
                dateList: dateList
            });
            DATE_LIST = dateList;
        },
        /*
            * 获取月的总天数
            */
        getTotalDayByMonth: function (year, month) {
            month = parseInt(month, 10);
            var d = new Date(year, month, 0);
            return d.getDate();
        },
            /*
            * 获取月的第一天是星期几
            */
        getWeek: function (year, month, day) {
            var d = new Date(year, month - 1, day);
            return d.getDay();
        },
        /**
         * 点击日期事件
         */
        onPressDate: function (e) {
            var { year, month, day } = e.currentTarget.dataset;
            //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
            if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0 || this.data.markcheckOutDate) return;

            var tempMonth = month;
            var tempDay = day;

            if (month < 10) tempMonth = '0' + month
            if (day < 10) tempDay = '0' + day

            var date = year + '-' + tempMonth + '-' + tempDay;
            var date2 = tempMonth + '月' + tempDay+ '日';
            if (!this.data.markcheckInDate) {
              this.setData({
                  checkInDate: date,
                  showCheckIn : date2,
                  markcheckInDate: true,
              });
            } else if (!this.data.markcheckOutDate) {
            if(Moment(date).before(this.data.checkInDate) ||date === this.data.checkInDate){//如果选择的离店时间等于入住时间或小于入住时间
                console.log("不能选择同一天或者之前的时间")
                return false;
            }else{
                this.setData({
                checkOutDate: date,
                showCheckOut : date2,
                markcheckOutDate: true,
                stayDays:Moment(date).differ(this.data.checkInDate)
                });
                this.selectDataMarkLine();
            }
            }  
            this.renderPressStyle(year, month, day);
        },
        renderPressStyle: function (year, month, day) {
            var dateList = this.data.dateList;
            //渲染点击样式
            for (var i = 0; i < dateList.length; i++) {
              var dateItem = dateList[i];
              var id = dateItem.id;
              if (id === year + '-' + month) {
                var days = dateItem.days;
                for (var j = 0; j < days.length; j++) {
                  var tempDay = days[j].day;
                  if (tempDay == day) {
                    days[j].class = days[j].class + ' active';
                    if(this.data.markcheckInDate && this.data.markcheckOutDate){
                      days[j].outday = true;
                      days[j].class = days[j].class + ' dayOut';
                    }else{
                      days[j].inday = true;
                      days[j].class = days[j].class + ' dayIn';
                    }
                    break;
                  }
                }
                break;
              }
            }
            this.setData({
              dateList: dateList
            });
        },
        //选择的入住与离店时间段
        selectDataMarkLine: function () {
            let dateList = this.data.dateList;
            let checkInDate  = this.data.checkInDate;
            let checkOutDate  = this.data.checkOutDate;
            let curreInid = checkInDate.substr(0, 4) + "-" + (checkInDate.substr(5, 2) < 10 ? checkInDate.substr(6, 1) : checkInDate.substr(5, 2));//选择入住的id
            let curreOutid = checkOutDate.substr(0, 4) + "-" + (checkOutDate.substr(5, 2) < 10 ? checkOutDate.substr(6, 1) : checkOutDate.substr(5, 2));//选择离店的id
            let dayIn = checkInDate.substr(8, 2) >= 10 ? checkInDate.substr(8, 2) : checkInDate.substr(9, 1);//选择入住的天id
            let dayOut = checkOutDate.substr(8, 2) >= 10 ? checkOutDate.substr(8, 2) : checkOutDate.substr(9, 1);//选择离店的天id
            let monthIn = checkInDate.substr(5, 2) >= 10 ? checkInDate.substr(5, 2) : checkInDate.substr(6, 1);//选择入店的月id
            let monthOut = checkOutDate.substr(5, 2) >= 10 ? checkOutDate.substr(5, 2) : checkOutDate.substr(6, 1);//选择离店的月id
            if (curreInid == curreOutid) {//入住与离店是当月的情况
            for (let i = 0; i < dateList.length; i++) {
                if (dateList[i].id == curreInid) {
                let days = dateList[i].days;
                for (let k = 0; k < days.length; k++) {
                    if (days[k].day >= dayIn && days[k].day <= dayOut) {
                    days[k].class = days[k].class + ' bgitem';
                    }
                }
                }
            }
            } else {//跨月
            for (let j = 0; j < dateList.length; j++) {
                if (dateList[j].month == monthIn) {//入住的开始月份
                let days = dateList[j].days;
                for (let k = 0; k < days.length; k++) {
                    if (days[k].day >= dayIn) {
                    days[k].class = days[k].class + ' bgitem';
                    }
                }
                } else {//入住跨月月份
                if (dateList[j].month < monthOut && dateList[j].month > monthIn) {//离店中间的月份
                    let days = dateList[j].days;
                    for (let k = 0; k < days.length; k++) {
                    days[k].class = days[k].class + ' bgitem';
                    }
                } else if (dateList[j].month == monthOut) {//离店最后的月份
                    let days = dateList[j].days;
                    for (let k = 0; k < days.length; k++) {
                    if (days[k].day <= dayOut) {
                        days[k].class = days[k].class + ' bgitem';
                    }
                    }
                }
                }
            }
            }
            this.setData({
            dateList: dateList
            })
        },
        confirm:function(){
            var _this = this
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
                checkInDate: _this.data.checkInDate,
                checkOutDate:_this.data.checkOutDate,
                stayDays:_this.data.stayDays
            })
            wx.navigateBack({
                delta: 1
            })
        }
    }
})