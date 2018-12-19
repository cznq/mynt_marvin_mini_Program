const app = getApp();
const date = new Date()
const days = []
const daysAlias = []
const hours = []
const minutes = []

for (let i = 0; i <= 23; i++) {
  hours.push(lessTen(i))
}

for (let i = 0; i < 60; i++) {
  minutes.push(lessTen(i))
}
function lessTen(t) {
  if (t < 10) {
    return '0' + t;
  } 
  return t;
}
function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}
function contains(arrays, obj) {
  var i = arrays.length;
  while (i--) {
    if (arrays[i] === obj) {
      return i;
    }
  }
  return false;
}

let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
let year = new Date().getFullYear();
const today = (date.getMonth() + 1) + '月' + date.getDate() + '日' + ' ' + weeks[date.getDay()];
const todayFmt = year + '-' + lessTen(date.getMonth() + 1) + '-' + lessTen(date.getDate())


returnFullDate(year);
returnFullDate(new Date().getFullYear() + 1);

function returnFullDate(year) {
  
  let daystr = '';
  let dayFmtstr = '';
  for (let month = 0; month <= 11; month++) {
    // 每个月的第一天
    let firstDay = new Date(year, month, 1);
    let dayInMonth = daysInMonth(month, year);
    // 每个月的最后一天
    let lastDay = new Date(year, month, dayInMonth);
    // 第一天星期几(0-6)
    let weekday = firstDay.getDay();
    // 最后一天星期几
    let lastDayWeekDay = lastDay.getDay();
    // 每一个都是从1号开始
    let date = 1;

    for (; date <= dayInMonth; date++) {
      daystr += (month + 1) + '月' + date + '日' + ' ' + weeks[weekday];
      dayFmtstr += year + '-' + lessTen(month + 1) + '-' + lessTen(date);
      if (todayFmt == dayFmtstr) {
        daystr = '今天';
      }
      weekday++
      days.push(daystr);
      daysAlias.push(dayFmtstr)
      daystr = ''; dayFmtstr = '';
      if (weekday % 7 == 0) {
        weekday = 0;
      }
    }
  }
}

var daysAt = contains(days, '今天'); 
//返回从今天以后的日期
var newDays = days.slice(daysAt, daysAt + 30);
var newdaysAlias = daysAlias.slice(daysAt, daysAt + 30);
daysAt = 0;

Page({

    /**
     * 页面的初始数据
     */
    data: {
      timePicker: {
        days: newDays,
        daysAlias: newdaysAlias,
        minutes: minutes,
        hours: hours
      },
      isIphoneX: app.globalData.isIphoneX,
      formData: {
        visitor_name: '',
        visit_time: '',
        visit_time_str: '',
        visit_intro: ''
      },
      now_datetime: [],
      visit_time_str: '',
      formReady: false,
      pickerShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
  },


  checkForm: function (e) {
    if (e.currentTarget.id == 'visitorName') {
      this.setData({
        'formData.visitor_name': e.detail.value
      });
    }
    if (e.currentTarget.id == 'visitIntro') {
      this.setData({
        'formData.visit_intro': e.detail.value
      });
    }
  },

  checkParam(visitor_name, visit_time, visit_intro) {
    if (visitor_name == "") {
      wx.showToast({
        title: '请输入您邀请的访客姓名',
        icon: 'none'
      })
      return false;
    } else if (visit_time == "") {
      wx.showToast({
        title: '请选择访客到访时间',
        icon: 'none'
      })
      return false;
    } else if (visit_intro == "") {
      wx.showToast({
        title: '请描述邀请访客到访的具体事由和到访的要求',
        icon: 'none'
      })
      return false;
    }
    return true;
  },
  /**
   * 提交表单
   * param: visitor_name, visit_intro, appointment_time
   */
  inviteSubmit: function (e) {
    console.log(this.data.formData.visit_time);
    var visitor_name = this.data.formData.visitor_name;
    var visit_intro = app.Util.decodeTextAreaString(this.data.formData.visit_intro);
    var appointment_time = app.Util.datetoTime(this.data.formData.visit_time);
    if (this.checkParam(visitor_name, this.data.formData.visit_time, visit_intro)) {
      var params = JSON.stringify({
        visitor_name: visitor_name,
        visit_intro: visit_intro,
        appointment_time: appointment_time
      })
      wx.navigateTo({
        url: '/pages/invite-visitor/share/index?params=' + params,
      })
    }
  },


  cancelPicker: function () {
    this.setData({
      pickerShow: false,
    })
  },

  confirmPicker: function () {
    var date = new Date();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    if (this.data.visit_time_str == '') {
      this.setData({
        visit_time_str: today + ' ' + hour + ':' + minute,
        'formData.visit_time': year + '-' + app.Util.strToDate(today + ' ' + hour + ':' + minute)
      })
    } 
    this.setData({
      pickerShow: false,
      'formData.visit_time_str': this.data.visit_time_str
    })
  },

  chooseTime: function (e) {
    var date = new Date();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    if (this.data.visit_time_str == '') {
      this.setData({
        now_datetime: [daysAt, date.getHours(), date.getMinutes()]
      })
    }
    this.setData({
      pickerShow: true
    })
  },

  selectInviteTime: function (e) {
    const val = e.detail.value
    console.log(val);
    if (this.data.timePicker.days[val[0]] == '今天') {
      var todayDate = today;
    } else {
      var todayDate = this.data.timePicker.days[val[0]]
    }
    this.setData({
      now_datetime: [val[0], val[1], val[2]],
      visit_time_str: todayDate + ' ' + this.data.timePicker.hours[val[1]] + ':' + this.data.timePicker.minutes[val[2]],
      'formData.visit_time': this.data.timePicker.daysAlias[val[0]] + ' ' + this.data.timePicker.hours[val[1]] + ':' + this.data.timePicker.minutes[val[2]]
    })
  }

})