const app = getApp()
Page({
  data: {
    text: '',
    url:'',
    timer: '',
    countDownNum: '3',
    isxxclogin: false,
    isgzhlogin:false
  },
  onLoad: function(options) {
    var _this = this;
    var opts = JSON.parse(options.opt);
    
    //拼接url的参数
    var urlWithArgs = '/'+options.route + '?'
    for (var key in opts) {
      var value = opts[key]
      urlWithArgs += key + '=' + value + '&'
    }
    _this.data.url = urlWithArgs;
    
    //检测登陆
    if (!(app.checkSession())) {
      app.checkLogin().then(function(res) {
        if (!(app.checkSession())) {
          _this.setData({
            isxcxlogin: true,
            isgzhlogin: false
          })
        } else {
          _this.setData({
            isxcxlogin: false,
            isgzhlogin:true
          })
          _this.countDown();
        }
      })
    } else {
      _this.setData({
        isxcxlogin: false,
        isgzhlogin: true
      })
      _this.countDown();
    }
  },
  //小程序授权登陆
  bindGetUserInfo: function() {
    var _this = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res);
              _this.setData({
                showLoginModal: false
              })
              app.authorizeLogin(res.encryptedData, res.iv, () => {
                wx.reLaunch({
                  url: _this.data.url,
                })
              });
            }
          })
        }
      }
    })
  },
  //倒计时跳转
  countDown: function () {
    let _this = this;
    let countDownNum = _this.data.countDownNum;
    _this.setData({
      timer: setInterval(function () {
        countDownNum--;
        _this.setData({
          countDownNum: countDownNum
        })
        if (countDownNum == 0) {
          clearInterval(_this.data.timer);
          wx.reLaunch({
            url: _this.data.url,
          })
        }
      }, 1000)
    })
  },
  //手动返回
  goback:function(){
    var _this = this;
    clearInterval(_this.data.timer);
    wx.reLaunch({
      url: _this.data.url,
    })
  }
})