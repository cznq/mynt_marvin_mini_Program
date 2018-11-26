const app = getApp();
const date = new Date()
const hour = date.getHours();
const minute = date.getMinutes();
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
hour < 10?('0'+hour):hour
minute < 10 ? ('0' + minute):hour

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
      invite_auth: null,
      latitude: null,
      longitude: null,
      cmpinfo: null,
      now_datetime: [daysAt, hour-1, minute],
      formready: false,
      invite_time: '',
      visit_intro: '',
      mark: '',
      input1: false,
      input2: false,
      pickerShow: false,
      edit: 'disabled'
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    var that = this;
    that.setData({
      date: app.Util.getDate(),
      time: app.Util.getTime()
    })

  },

  /**
   * 判断是否员工
   */
  setDataRequest: function () {
    var that = this;
    that.setData({
      invite_auth: wx.getStorageSync('invite_auth')
    })
    if (that.data.invite_auth == true) {
      that.getCompany();
    } else {
      wx.redirectTo({
        url: '/pages/manage/manage',
      })
    }
  },

  /**
   * 获取公司信息
   */
  getCompany: function () {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res);
        if (res.data.result) {
          that.setData({
            cmpinfo: res.data.result
          })
        }
        app.Util.generateMap(that, res.data.result.address);
      }
    })
  },

  checkForm: function (e) {
    var val = app.Util.filterEmoji(e.detail.value);
    if (e.detail.value !== '' && e.currentTarget.id == 'i1') {
      this.setData({
        input1: true
      });
    }
    if (e.detail.value !== '' && e.currentTarget.id == 'i2') {
      this.setData({
        input2: true,
        visit_intro: e.detail.value
      });
    }
    if (e.detail.value !== '' && e.currentTarget.id == 'i3') {
      this.setData({
        mark: e.detail.value
      });
    }
    if (this.data.input1 && this.data.input2) {
      this.setData({
        formready: true
      });
    }
    return val;
  },

  /**
   * 提交表单
   * param: visitor_name, mark, visit_intro, appointment_time
   */
  inviteSubmit: function (e) {
    var visit_time = this.data.date + ' ' + this.data.time;
    var visitor_name = e.detail.value.visitor_name;
    var mark = app.Util.decodeTextAreaString(this.data.mark);
    var visit_intro = app.Util.decodeTextAreaString(this.data.visit_intro);
    var appointment_time = app.Util.datetoTime(visit_time);
    if (visitor_name == "" || visit_intro == "") {
      wx.showModal({
        content: '请填写被邀请人或邀请说明',
        showCancel: false,
        success: function (res) { }
      })
      return;
    }
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'invite',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          visitor_name: visitor_name,
          invitation_type: 0,
          introduction: visit_intro,
          note: mark,
          appointment_time: appointment_time
        })
      },
      success: res => {
        console.log(res);
        if (res.data.result.invitation_id) {
          wx.redirectTo({
            url: '/pages/invite-visitor/share/index?invitation_id=' + res.data.result.invitation_id,
          })
        } else {
          wx.showModal({
            content: '提交失败',
            showCancel: false,
            success: function (res) {

            }
          })
        }
      },
    })
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
    this.setData({
      pickerShow: true,
      invite_time: today + ' ' + hour + ':' + minute
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
      invite_time: todayDate + ' ' + this.data.timePicker.hours[val[1]] + ':' + this.data.timePicker.minutes[val[2]]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap');
    this.mapCtx.moveToLocation();
  },

  openLocation: function () {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 28
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.removeStorageSync('xy_session');
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.setDataRequest();
      })
    } else {
      that.setDataRequest();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.removeStorageSync('xy_session');
    var that = this;
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.setDataRequest();
      })
    } else {
      that.setDataRequest();
    }
  },

  onHide: function () {
    //wx.removeStorageSync('xy_session');
  }

})