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
    invitation_id: null,
    visit_company_id: null,
    hasAccept: false,
    arrayFandR: '' //拼接楼房
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.invitation_id)
    this.data.invitation_id = options.invitation_id;
  },

  getInitation(_this, invitation_id) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: invitation_id
        })
      },
      showLoading: false,
      success: res => {
        if (res.data.result) {
          //更改邀请函阅读状态
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#007BFF'
          })
          if (res.data.result.read_status == 0) {
            _this.changeReadStatus(_this);
          }
          if (res.data.result.visitor.visitor_id !== 0) {
            _this.setData({
              hasAccept: true
            })
          }
          _this.setData({
            invitation: res.data.result,
            appointment_time: app.Util.formatTime(res.data.result.appointment_time)
          })
          _this.joinFloorRoom(_this.data.invitation.company.company_floor, _this.data.invitation.company.company_room)
          app.Util.generateMap(_this, res.data.result.company.address);

        } else {
          wx.showToast({
            title: '获取邀请失败',
            icon: 'none'
          })
        }

      },
      fail: res => {
        wx.showToast({
          title: '没有获取到邀请信息',
          icon: 'none'
        })
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
  receiveSubmit(e) {
    var that = this;
    var params = {
      invitation_id: that.data.invitation_id,
      form_id: e.detail.formId,
      company_id: that.data.invitation.company.company_id
    }
    app.checkHasRecodeFace('visitor', that.data.invitation.company.company_id, function(res) {
      if (res == '') {

        if (that.data.invitation.company.is_force_visitor_input_info == 0) {
          wx.navigateTo({
            url: '/pages/collect-info/guide/index?source=invite&params=' + JSON.stringify(params) + '&hideIdCard=true',
          })
        } else {
          wx.navigateTo({
            url: '/pages/collect-info/guide/index?source=invite&params=' + JSON.stringify(params),
          })
        }

      } else {
        app.receiveSubmit(that.data.invitation_id, e.detail.formId, function() {
          that.getInitation(that, that.data.invitation_id)
        })
      }

    })


  },
  //更改邀请函阅读状态
  changeReadStatus(_this) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'update_Invitation',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: _this.data.invitation_id,
          read_status: 1
        })
      },
      success: res => {},
      fail: res => {}
    })
  },

  onShow: function() {
    this.getInitation(this, this.data.invitation_id);
  }

})