const app = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
    isIphoneX: app.globalData.isIphoneX,
    version: app.globalData.version,
    latitude: null,
    longitude: null,
    appointment_time: '',
    inviteInfo: {},
    companyInfo: null,
    empInfo: null,
    shareBtn: true,
    arrayFandR: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var params = JSON.parse(options.params);
    this.setData({
      inviteInfo: params,
      appointment_time: app.Util.formatTime(params.appointment_time)
    })
    this.getCompanyInfo();

  },

  /**
   * 获取员工信息
   */
  getEmployeeInfo: function() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            empInfo: res.data.result
          });
        }
        //提交邀请函
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'visitor',
            method: 'invite',
            data: JSON.stringify({
              union_id: wx.getStorageSync('xy_session'),
              visitor_name: that.data.inviteInfo.visitor_name,
              invitation_type: 0,
              introduction: that.data.inviteInfo.visit_intro,
              appointment_time: that.data.inviteInfo.appointment_time
            })
          },
          success: res => {
            if (res.data.result.invitation_id) {
              that.setData({
                invitation_id: res.data.result.invitation_id,
                shareBtn: false
              })
            } else {
              wx.showToast({
                title: '邀请提交失败',
                icon: 'none'
              })
            }
          },
        })

      }
    })
  },

  getCompanyInfo: function() {

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
        console.log(res.data);
        if (res.data.result) {
          that.setData({
            companyInfo: res.data.result
          })
          that.joinFloorRoom(that.data.companyInfo.floor, that.data.companyInfo.room)
        }
        that.getEmployeeInfo();
        app.Util.generateMap(that, res.data.result.address);
      }
    })
  },
  joinFloorRoom(floor, room) {
    let arrayFloor = floor.split(',');
    let arrayRoom = room.split(',');
    let arrayLen = arrayFloor.length;
    let arrayFandR = [];
    let FloorAnRoom = '';
    for (let i = 0; i < arrayLen; i++) {
      let FloorAndRoom = arrayFloor[i] + ' ' + arrayRoom[i] + '室'
      arrayFandR.push(FloorAndRoom)
    }
    switch (arrayLen) {
      case 1:
        FloorAnRoom = `${arrayFandR[0]}`
        break;
      case 2:
        FloorAnRoom = `${arrayFandR[0]}，${arrayFandR[1]}`
        break;
      case 3:
        FloorAnRoom = `${arrayFandR[0]}，${arrayFandR[1]}，
             ${arrayFandR[2]}`
        break;
      case 4:
        FloorAnRoom = `${arrayFandR[0]}，${arrayFandR[1]}，
              ${arrayFandR[2]}， ${arrayFandR[3]}`
        break;
      case 5:
        FloorAnRoom = `${arrayFandR[0]}，${arrayFandR[1]}，
                ${arrayFandR[2]}，${arrayFandR[3]}，${arrayFandR[4]}`
        break;
      default:

    }
    this.setData({
      arrayFandR: FloorAnRoom
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.mapCtx = wx.createMapContext('address-map');
    this.mapCtx.moveToLocation();
  },

  openLocation: function() {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 28
    })
  },

  backAction: function() {
    wx.navigateBack()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: that.data.companyInfo.company_short_name + '给您发送了一个邀请，期待您的到访！',
      path: '/pages/invite-visitor/receive/index?invitation_id=' + that.data.invitation_id,
      success: function(res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }

  }
})