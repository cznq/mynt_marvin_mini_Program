const app = getApp();
const date = new Date()
const month = date.getMonth();
const day = date.getDate()-1;
const hour = date.getHours()-1;
const minute = date.getMinutes()-1;

const months = []
const days = []
const hours = []
const minutes = []

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

for (let i = 1; i <= 24; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  hours.push(i)
}

for (let i = 1; i <= 60; i++) {
  if (i < 10) {
    i = '0' + i;
  }
  minutes.push(i)
}
hour < 10?('0'+hour):hour
minute < 10 ? ('0' + minute):hour

console.log(month+' '+day+' '+hour+' '+minute);
Page({

    /**
     * 页面的初始数据
     */
    data: {
      timePicker: {
        months: months,
        days: days,
        minutes: minutes,
        hours: hours
      },
      isIphoneX: app.globalData.isIphoneX,
      invite_auth: null,
      latitude: null,
      longitude: null,
      cmpinfo: null,
      now_datetime: [month, day, hour, minute],
      formready: false,
      invite_time: '',
      visit_intro: "",
      mark: "",
      input1: false,
      input2: false,
      pickerShow: false
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
            url: '/pages/invite-share/invite-share?invitation_id=' + res.data.result.invitation_id,
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

  closePicker: function () {
    this.setData({
      pickerShow: false
    })
  },

  chooseTime: function (e) {
    this.setData({
      pickerShow: true
    })
  },

  selectInviteTime: function (e) {
    const val = e.detail.value
    console.log(val);
    this.setData({
      invite_time: this.data.timePicker.months[val[0]] + '-' + this.data.timePicker.days[val[1]] + ' ' + this.data.timePicker.hours[val[2]] + ':' + this.data.timePicker.minutes[val[3]]
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