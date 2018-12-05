const app = getApp();
const date = new Date()
const days = []
const hours = []
const minutes = []

for (let i = 1; i <= 24; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  hours.push(i)
}

for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  minutes.push(i)
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
const today = (date.getMonth() + 1) + '月' + date.getDate() + '日' + ' ' + weeks[date.getDay()];

let year = new Date().getFullYear();
let daystr = '';
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
    if (daystr == today) {
      daystr = '今天';
    }
    weekday++
    days.push(daystr);
    daystr = '';
    if (weekday % 7 == 0) {
      weekday = 0;
    }
  }
}
const daysAt = contains(days, '今天');

Page({

    /**
     * 页面的初始数据
     */
    data: {
      timePicker: {
        days: days,
        minutes: minutes,
        hours: hours
      },
      isIphoneX: app.globalData.isIphoneX,
      now_datetime: [],
      formData: {
        visitor_name: '',
        visit_time: '',
        visit_intro: ''
      },
      visit_time_str: '',
      formReady: false,
      pickerShow: false,
      edit: 'disabled'
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
 
    },

  /**
   * 判断是否员工
   */
  setDataRequest: function () {
    if (wx.getStorageSync('invite_auth') !== true) {
      wx.redirectTo({
        url: '/pages/manage/manage',
      })
    } 
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
    var visitor_name = this.data.formData.visitor_name;
    var visit_intro = app.Util.decodeTextAreaString(this.data.formData.visit_intro);
    var appointment_time = app.Util.datetoTime(this.data.formData.visit_time);
    if (this.checkParam(visitor_name, appointment_time, visit_intro)) {
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

  /**
   * 编辑按钮
   */
  openEdit: function () {
    this.setData({
      edit: ''
    });
  },

  closePicker: function () {
    this.setData({
      pickerShow: false,
    })
  },

  chooseTime: function (e) {
    var date = new Date();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    
    this.setData({
      now_datetime: [daysAt, date.getHours() - 1, date.getMinutes()],
      pickerShow: true,
      visit_time_str: today + ' ' + hour + ':' + minute,
      'formData.visit_time': year + '-' + app.Util.strToDate(today + ' ' + hour + ':' + minute)
    })
  },

  selectInviteTime: function (e) {
    const val = e.detail.value
    if (this.data.timePicker.days[val[0]] == '今天') {
      var todayDate = today;
    } else {
      var todayDate = this.data.timePicker.days[val[0]]
    }
    this.setData({
      visit_time_str: todayDate + ' ' + this.data.timePicker.hours[val[1]] + ':' + this.data.timePicker.minutes[val[2]],
      'formData.visit_time': year + '-' + app.Util.strToDate(todayDate + ' ' + this.data.timePicker.hours[val[1]] + ':' + this.data.timePicker.minutes[val[2]])
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setDataRequest();
    
  }

})