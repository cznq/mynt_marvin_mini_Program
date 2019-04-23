// benifit/pages/hotel-reserve/index.js
var toast = require('../../../templates/showToast/showToast');
var util = require("../../../utils/util.js");
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
    price:'',//房间协议价
    discountPrice:'',//优惠金额
    totalPrice:''//总金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var price = options.price
    var store_price = options.store_price//门店价
    var discountPriceOne = store_price-price//单个房间优惠金额
    var num = this.data.num
    that.setData({
      isIphone: app.globalData.isIphone,
      commerce_id: options.commerce_id,
      hotel_room_id:options.hotel_room_id,
      price:price,
      totalPrice:price*num,
      discountPriceOne:discountPriceOne,
      discountPrice:discountPriceOne*num
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
    var discountPriceOne = this.data.discountPriceOne
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    this.setData({
      num: num,
      totalPrice:num*price,
      discountPrice :num*discountPriceOne,
    });
  },
  /* 点击加号 */
  bindPlus: function() {
    var num = this.data.num;
    var price = this.data.price
    var discountPriceOne = this.data.discountPriceOne
    num++;
    this.setData({
      num: num,
      totalPrice:num*price,
      discountPrice :num*discountPriceOne,
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = parseInt(e.detail.value);
    var price = this.data.price
    var discountPriceOne = this.data.discountPriceOne
    this.setData({
      num: num,
      totalPrice:num*price,
      discountPrice :num*discountPriceOne,
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
      selectData: e.detail[0],
      selectTimeId:e.detail[1]
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
    var _this = this;
    let commerce_id = _this.data.commerce_id;//商家ID
    let book_begin_time = _this.data.checkInDate //入住开始时间
    let book_end_time = _this.data.checkOutDate //入住结束时间
    let room_num =e.detail.value.num;//房间数
    let contact_name = (e.detail.value.order_name).replace(/\s+/g, '');//入住人姓名
    let contact_tel = (e.detail.value.phone).replace(/\s+/g, '');//手机号
    let arrive_time = _this.data.selectData //预计到店时间
    let arrive_hour = _this.data.selectTimeId //预计到店小时数
    let expect_arrive_time=""//预计到店时间
    let remark = (e.detail.value.remark).replace(/\s+/g, '') //备注
    let hotel_room_id = _this.data.hotel_room_id
    if(book_begin_time ==''){
      _this.Toast('请选择入住时间')
      return false
    }else{
      book_begin_time =  parseInt((new Date(book_begin_time+' 00:00:00')).getTime()/1000)
      book_end_time = parseInt((new Date(book_end_time+' 00:00:00')).getTime()/1000)
    }
    if (contact_name == '') {
      _this.Toast('请填写入住人')
      return false
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (contact_tel == '') {
      _this.Toast('请填写手机号')
      return false
    }else if(!myreg.test(contact_tel)){
      _this.Toast('请填写有效的手机号')
      return false
    }
    let checkInDate = _this.data.checkInDate
    if(arrive_time == "请选择到店时间"){
      _this.Toast('请选择到店时间')
      return false
    }else{
      if (arrive_hour<24) {
        if (arrive_hour < 10){
          arrive_hour = "0" + arrive_hour + ":00"
        }else{
          arrive_hour = arrive_hour + ":00"
        }
        expect_arrive_time =  parseInt((new Date(checkInDate+' '+arrive_hour)).getTime()/1000)
      } else {
        arrive_hour = arrive_hour-24
        if (arrive_hour < 10){
          arrive_hour = "0" + arrive_hour + ":00"
        }else{
          arrive_hour = arrive_hour + ":00"
        }
        let expect_day = util.getNextDay(checkInDate)
        expect_arrive_time =  parseInt((new Date(expect_day+' '+arrive_hour)).getTime()/1000)
      }
    }
    if(remark==""){
      _this.Toast('请备注您的需求')
      return false
    }
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/commerce/book/hotel/apply",
      params: {
        data: JSON.stringify({
          commerce_id:commerce_id,
          book_begin_time: book_begin_time,
          book_end_time:book_end_time,
          room_num:room_num,
          contact_name:contact_name,
          contact_tel:contact_tel,
          expect_arrive_time:expect_arrive_time,
          remark:remark,
          hotel_room_id:hotel_room_id
        })
      },
      success: res => {
        console.log(res);
        if(res.data.sub_code =='SUCCESS'){
          var params = JSON.stringify({
            apply_time: res.data.result.apply_time,
            book_no: res.data.result.book_no,//订单号
            expect_confirm_time: res.data.result.expect_confirm_time,
          })
          wx.navigateTo({
            url: '/banquet/pages/reserve-success/index?params='+params+ '&router='+ 'reserve',
          })
        }else if(res.data.sub_code ==''){
          _this.Toast("服务器异常请重试")
        }
      },
      fail: res => {
        console.log('fail');
      }
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