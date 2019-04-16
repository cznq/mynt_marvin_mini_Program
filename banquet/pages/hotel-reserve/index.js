// benifit/pages/hotel-reserve/index.js
var toast = require('../../../templates/showToast/showToast');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphone: false,
    commerce_id: null,
    commerce_type: null,
    checkInDate:'',
    num: 1,
    max: '100',
    selectData: '请选择到店时间',
    price:'',
    totalPrice:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var price = options.price
    var num = this.data.num
    that.setData({
      isIphone: app.globalData.isIphone,
       commerce_id: options.commerce_id,
      // commerce_type: options.commerce_type
      price:price,
      totalPrice:price*num
    })
    that.getDetailInfo(that.data.commerce_id);
  },
  /**
   * 获取商家详情
   */
  getDetailInfo(commerce_id) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'commerce',
        method: 'get_commerce_info',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          commerce_id: commerce_id
        })
      },
      success: res => {
        if (res.data.result) {
          if (res.data.result.details) {
            wx.setNavigationBarTitle({
              title: res.data.result.name
            })
          }
        }
      }
    })
  },
  /* 点击减号 */
  bindMinus: function() {
    var num = this.data.num;
    var price = this.data.price
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    this.setData({
      num: num,
      totalPrice:num*price
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    var price = this.data.price
    num++;
    this.setData({
      num: num,
      totalPrice:num*price
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = parseInt(e.detail.value);
    var price = this.data.price
    this.setData({
      num: num,
      totalPrice:num*price
    });
  },
  remarksText: function(e) {
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    this.setData({
      currentWordNumber: len //当前字数
    })
  },
  selectDate: function() {
    wx.navigateTo({
      url: '../calendar-hotel/index'
    })
  },
  // 预计到店时间段
  onSelect(e) {
    this.setData({
      selectData: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.stayDays > 0) {
      that.setData({
        checkInDate: currPage.data.checkInDate,
        checkOutDate: currPage.data.checkOutDate,
        stayDays: currPage.data.stayDays
      })
    }
  },
  formSubmit:function(e){
    console.log(e)
    var _this = this;
    let checkInDate = this.data.checkInDate
    let checkOutDate = this.data.checkOutDate
    let stayDays = this.data.stayDays
    let time = '';//入住时间
    let room_num =e.detail.value.num;//房间数
    let room_name = (e.detail.value.order_name).replace(/\s+/g, '');//入住人姓名
    let phone = (e.detail.value.phone).replace(/\s+/g, '');//手机号
    let arrive_time = _this.data.selectData //预计到店时间
    let remark = e.detail.value.remark //备注
    if(checkInDate ==''){
      _this.Toast('请选择入住时间')
      return false
    }else{
      checkInDate = (new Date(this.data.checkInDate)).getTime()
      checkOutDate = (new Date(this.data.checkOutDate)).getTime()
    }
    if (room_name == '') {
      _this.Toast('请填写入住人')
      return false
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (phone == '') {
      _this.Toast('请填写手机号')
      return false
    }else if(!myreg.test(phone)){
      _this.Toast('请填写有效的手机号')
      return false
    }
    wx.navigateTo({
      url: '/banquet/pages/reserve-success/index',
    })
  },
  Toast: function(text) {
    toast.showToast(this, {
      toastStyle: 'toast',
      title: text,
      duration: 1500,
      mask: false
    });
  },
})