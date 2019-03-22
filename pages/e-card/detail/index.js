import {
  CityList
} from './pca.js';
const app = getApp();
var count = 1;
import initCalendar, {
  jump,
  getSelectedDay
} from '../../../components/calendar/main.js';

const conf = {
  multi: true, // 是否开启多选,
  disablePastDay: true, // 是否禁选过去的日期
  /**
   * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
   * 注意：若想初始化时不默认选中当天，则将该值配置为除 undefined 以外的其他非值即可，如：空字符串, 0 ,false等。
   */
  // defaultDay: '', // 初始化后是否默认选中指定日期
  noDefault: true, // 初始化后是否自动选中当天日期，优先级高于defaultDay配置，两者请勿一起配置
  /**
   * 选择日期后执行的事件
   * @param { object } currentSelect 当前点击的日期
   * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
   */
  afterTapDay: (currentSelect, allSelectedDays) => {
    console.log('currentSelect:', currentSelect, 'allSelectedDays:', allSelectedDays);
  },
  /**
   * 当改变月份时触发
   * @param { object } current 当前年月
   * @param { object } next 切换后的年月
   */
  // whenChangeMonth: (current, next) => {},
  /**
   * 日期点击事件（此事件会完全接管点击事件）
   * @param { object } currentSelect 当前点击的日期
   * @param { object } event 日期点击事件对象
   */
  // onTapDay(currentSelect, event) {},
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   * @param { object } ctx 当前页面实例
   */
  afterCalendarRender(ctx) {},
}
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
    arrayFandR: '',
    codes: [],
    city: 'wwwww',
    citylist: CityList
  },
  onSelect(e) {
    console.log(e);
    this.setData({
      codes: e.detail.code,
      city: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    initCalendar(conf);
    // jump({
    //   year: '2019',
    //   month: '3',
    //   day: '25'
    // })
    // console.log('getSelectedDay', getSelectedDay());
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
          floor: that.data.floor
        })
      },
      success: res => {
        console.log(res.data);
        if (res.data.result) {
          that.setData({
            floor_qrcode_url: res.data.result.qrcode_url,
            floors: res.data.result.floors,
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
          that.getFloorQrcode();
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
        }

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
  },

  onReady: function() {
    var that = this;
    that.canvasRing = that.selectComponent("#canvasRing");
    that.canvasRing.showCanvasRing();
  },
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']
            data.multiArray[2] = ['猪肉绦虫', '吸血虫']
            break
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物']
            data.multiArray[2] = ['鲫鱼', '带鱼']
            break
        }
        data.multiIndex[1] = 0
        data.multiIndex[2] = 0
        break
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫']
                break
              case 1:
                data.multiArray[2] = ['蛔虫']
                break
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥']
                break
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓']
                break
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物']
                break
            }
            break
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼']
                break
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼']
                break
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎']
                break
            }
            break
        }
        data.multiIndex[2] = 0
        break
    }
    console.log(data.multiIndex)
    this.setData(data)
  }
})