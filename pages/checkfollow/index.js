// pages/checkfollow/index.js
var app = getApp();
var toast = require('../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isiphoneX: app.globalData.isIphoneX,
    button_text:'我已关注',
    disabled:true,
    checked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this =this;
    console.log(options)
    //拼接url的参数
    _this.data.url = '/' + options.route + '?' + options.opt
  },
  //单选按钮
  radioChange:function(e){
    var _this = this;
    console.log(e);
    if (_this.data.checked && !_this.data.disabled) {
      _this.setData({
        disabled: true,
        checked: false
      })
    } else {
      _this.setData({
        disabled: false,
        checked: true
      })
    }
    
  },
  /**
    * 检查是否关注
    */
  getEmployeeInfo: function () {
    var _this = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'oauth',
        method: 'check_follow',
        data: JSON.stringify({
          union_id: unionId,
        }),
        isloading:false
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code==0){
          if (res.data.result.follow == 1){
            wx.redirectTo({
              url: _this.data.url,
            })
          }else{
            toast.showToast(this, {
              toastStyle: 'toast toast2',
              title: '为更好使用楼宇服务\n请先关注公众号',
              duration: 2000,
              mask: false,
              isArrow: true
            });
            _this.setData({
              disabled: true,
              checked: false
          })
          }
        }
      }
    })
  },
  //我已关注按钮
  next:function(){
    var _this = this;
    _this.getEmployeeInfo();
  }
})