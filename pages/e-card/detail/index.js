const app = getApp();
var count = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation_id: null,
    floor_qrcode_url: null,
    cmpInfo: null,
    title: '员工电梯卡',
    qrcode_tips: '该码实时更新，请勿泄露。',
    avatar: '',
    error_msg: null,
    lbtnLose: true,
    rbtnLose: false,
    cur_Item: 0,
    floors: [],
    floor: '',
    multiple_item: 3,
    show: true,
    curren_idx: 0,
    arrayFandR: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.invitation_id) {
      that.data.invitation_id = options.invitation_id;
      that.setData({
        title: '访客电梯卡',
        qrcode_tips: '该码30分钟内有效，请勿泄露。'
      })
      wx.setNavigationBarTitle({
        title: '访客电梯卡'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '员工电梯卡'
      })
    }
  },
  clicItem(e) {
    let current = e.currentTarget.dataset.current
    let floor = e.currentTarget.dataset.floor
    this.setData({
      curren_idx: current,
      floor: floor
    })
    this.getFloorQrcode()
  },
  clik_lBtn() {
    let cur_Item = this.data.cur_Item - 1
    if (count == 1) {
      this.setData({
        lbtnLose: true,
      })
      return false
    } else {
      count = count - 1
      this.setData({
        rbtnLose: false,
      })
      if (count == 1) {
        this.setData({
          lbtnLose: true,
        })
      }
    }
    this.setData({
      cur_Item: cur_Item
    })
  },
  clik_rBtn() {
    let cur_Item = this.data.cur_Item + 1
    let step = this.data.floors.length - 3
    if (count > step) {
      this.setData({
        rbtnLose: true,
      })
      return false
    } else {
      count = count + 1
      this.setData({
        lbtnLose: false,
      })
      if (count > step) {
        this.setData({
          rbtnLose: true,
        })
      }
    }
    this.setData({
      cur_Item: cur_Item
    })
  },
  stopTouchMove: function() {
    return false;
  },
  getFloorQrcode() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'building',
        method: 'get_floor_qrcode',
        data: JSON.stringify({
          invitation_id: that.data.invitation_id,
          floor: that.data.floor,
        })
      },
      success: res => {
        console.log(res.data);
        if (res.data.result) {
          that.setData({
            floor_qrcode_url: res.data.result.qrcode_url,
            floors: res.data.result.floors,
            error_msg: ''
          })
          if (that.data.floors != '') {
            that.initSwiperShow()
          }
        } else {
          that.setData({
            error_msg: res.data.sub_msg,
          })

        }

      },
      fail: res => {

      }
    });
  },
  /**
   * 刷新二维码
   */
  refreshQrcode() {
    this.getFloorQrcode();
  },
  initSwiperShow() {
    let floorsLen = this.data.floors.length;
    if (floorsLen > 3) {
      floorsLen = 3
    } else {
      this.setData({
        rbtnLose: true
      })
    }
    this.setData({
      multiple_item: floorsLen
    })
  },
  /**
   * 获取公司信息
   */
  getCompany: function() {
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
        if (res.data.result) {
          that.setData({
            cmpInfo: res.data.result
          })
          console.log('cmpInfo:', that.data.cmpInfo);
          that.joinFloorRoom(that.data.cmpInfo.floor, that.data.cmpInfo.room)
        }
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
                avatar: res.data.result.input_pic_url
              });
            }
          }
        })
        that.getFloorQrcode();
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
   * 获取邀请信息
   */
  getInitation: function() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: that.data.invitation_id
        })
      },
      success: res => {
        if (res.data.result) {

          that.setData({
            'cmpInfo.address': res.data.result.company.address,
            'cmpInfo.floor': res.data.result.company.company_floor,
            'cmpInfo.room': res.data.result.company.company_room,
            'cmpInfo.company_code': res.data.result.company.company_code,
            'cmpInfo.logo': res.data.result.company.company_logo,
            'cmpInfo.company_name': res.data.result.company.company_name,
            'cmpInfo.company_short_name': res.data.result.company.company_short_name,
            'cmpInfo.logo': res.data.result.company.company_logo,
            avatar: res.data.result.visitor.input_pic_url
          })
          that.joinFloorRoom(that.data.cmpInfo.floor, that.data.cmpInfo.room)
        }
        that.getFloorQrcode();
      },
      fail: res => {

      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (this.data.invitation_id) {
      this.getInitation();
    } else {
      this.getCompany();
    }
  }

})