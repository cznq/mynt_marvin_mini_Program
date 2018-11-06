var app = getApp();
Page({
  data: {
    mainTitle: '输入真实姓名',
    button_text: '立即进入'
  },
  onLoad: function(options) {
    var _this = this;
    //请求接口
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_review_status',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code == 0) {
          console.log('数据成功');
          _this.setData({
            name: res.data.result.name,
            company_name: res.data.result.company_name
          })
        } else {
          app.globalData.fundebug.notify("创建成功/get_review_status", res.data.sub_msg);
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  next: function() {
    wx.reLaunch({
      url: '../../manage/manage',
    })
  }
})