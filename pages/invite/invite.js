// pages/invite/invite.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xy_session: null,
    invite_auth: null,
    latitude: null,
    longitude: null,
    cmpinfo: null,
    invite_auth: null,
    date: "",
    time: "",
    formready: false,
    visit_intro: "",
    mark: "",
    input1: false,
    input2: false
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

  setDataRequest: function () {
    var that = this;
    that.setData({
      xy_session: wx.getStorageSync('xy_session'),
      invite_auth: wx.getStorageSync('invite_auth')
    })
    if (that.data.invite_auth == true) {
      that.getCompany();
    } else {
      wx.showModal({
        title: '你没有邀请权限',
        content: '请先加入成为公司员工，才能获得邀请权限',
        showCancel: false,
        success: function (res) {

        }
      })
    }
  },

  getCompany: function () {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({})
      },
      success: res => {
        console.log(res);
        if (res.data.result) {
          that.setData({
            cmpinfo: res.data.result
          })
        }
        that.generateMap(res.data.result.address);
      }
    })
  },

  generateMap: function (address) {
    var that = this;
    var qqmapsdk = new QQMapWX({
      key: 'CGVBZ-S2KHV-3CBPC-UP4JI-4N55F-7VBFU'
    });
    qqmapsdk.geocoder({
      address: address,
      success: function (res) {
        that.setData({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
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

  inviteSubmit: function (e) {
    var visit_time = this.data.date + ' ' + this.data.time; 
    var visitor_name = e.detail.value.visitor_name;
    var mark = app.Util.decodeTextAreaString(this.data.mark);
    var visit_intro = app.Util.decodeTextAreaString(this.data.visit_intro);
    var appointment_time = app.Util.datetoTime(visit_time);
    if (visitor_name == "" || visit_intro == "" ) {
      wx.showModal({
        content: '请填写被邀请人或邀请说明',
        showCancel: false,
        success: function (res) {}
      })
      return;
    }
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'invite',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          visitor_name: visitor_name,
          invitation_type: 0,
          introduction: visit_intro,
          note: mark,
          appointment_time: appointment_time
        })
      },
      success: res => {
        console.log(res);
        if(res.data.result.invitation_id){
          wx.redirectTo({
            url: '/pages/invite-share/invite-share?invitation_id=' + res.data.result.invitation_id,
          })
        }else{
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

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
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

  onHide: function() {
    //wx.removeStorageSync('xy_session');
  }

})