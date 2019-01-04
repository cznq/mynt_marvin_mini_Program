// pages/checkfollow/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    button_text:'我已关注',
    disabled:true,
    checked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //_this.data.islock = false;
  },
  // onShow: function () {
  //   var _this = this;
  //   console.log(_this.data.islock);
  //   if (_this.data.islock){
  //     console.log('fffff');
  //     var _this = this;
  //     _this.getEmployeeInfo();
  //   }
  // },

  radioChange:function(e){
    var _this = this;
    _this.setData({
      disabled: false,
      checked: true
    })
  },
  /**
    * 获取员工信息
    */
  getEmployeeInfo: function () {
    var _this = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: unionId,
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code==0){
          _this.setData({
            disabled: false,
            checked: true
          })
        }
      }
    })
  },
  next:function(){
    var _this = this;
    _this.getEmployeeInfo();
  },
  ddd:function(){
    wx.navigateTo({
      url: '/pages/manage/manage'
    })
  }

})