const app = getApp()
Page({
  data: {
    text: '',
    url:''
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
  },
  //小程序授权登陆
  bindGetUserInfo: function() {
    var _this = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          _this.wxGetUserInfo(_this)
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              _this.wxGetUserInfo(_this)
            }
          })
        }
      }
    })
  },

  wxGetUserInfo(_this) {
    wx.getUserInfo({
      success: function (res) {
        app.authorizeLogin(res.encryptedData, res.iv, () => {
          wx.reLaunch({
            url: _this.data.url,
          })
        });
      }
    })
  }

})