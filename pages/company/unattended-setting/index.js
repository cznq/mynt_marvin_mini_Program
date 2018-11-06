// pages/company-unattended/index.js
var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '无人值守',
    introduce: '如果您无法及时处理访客申请，或您希望访客无需通过申请即可取卡，请开启此功能',
    explain: '无人值守功能已开启,请留意您的访客',
    isShow: true,
    isChecked: true,
    union_id: wx.getStorageSync('xy_session')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: that.data.union_id
        })
      },
      success: res => {
        var resdata = res.data.result;
        // resdata.attend_status = 0;
        if (resdata) {
          that.setData({
            isChecked: resdata.attend_status == 1 ? true : false,
            isShow: resdata.attend_status == 1 ? false : true
          })
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  bindSwitchChange: function(e) {
    if (e.detail.value) {
      toast.showToast(this, {
        toastStyle: 'toast4',
        title: '注意',
        introduce: '开启无人值守，未预约访客取卡无需前台确认，为确保公司安全，请谨慎开启',
        mask: true,
        isSure: true,
        sureText: '仍然打开',
        isClose: true,
        closeText: '取消'
      });
    } else {
      var that = this;
      that.postRequestOwn(0);
      that.setData({
        isChecked: false,
        isShow: true
      });
    }

  },

  bindToastSure: function(value) {
    var that = this;
    that.postRequestOwn(1);
    that.setData({
      isChecked: true,
      isShow: false
    });
    toast.hideToast();
  },

  bindToastClose: function() {
    var that = this;
    that.setData({
      isChecked: false,
      isShow: true
    })
    toast.hideToast();
  },

  postRequestOwn: function(attend_status) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'update_attend_status',
        data: JSON.stringify({
          union_id: this.data.union_id,
          attend_status: attend_status
        })
      },
      success: res => {},
      fail: res => {
        console.log('fail');
      }
    })
  }
})