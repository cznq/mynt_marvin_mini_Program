const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation_id: null,
    floor_qrcode_url: null,
    cmpInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.invitation_id = options.invitation_id;
    
    that.getFloorQrcode();
    that.getCompany();
    
  },

  getFloorQrcode(invitation_id) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'building',
        method: 'get_floor_qrcode',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: invitation_id
        })
      },
      success: res => {
        console.log(res.data);
        if (res.data.result) {
          this.setData({
            floor_qrcode_url: res.data.result.qrcode_url
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.sub_msg,
          })
        }
        
      },
      fail: res => {
        
      }
    });
  },

  /**
 * 获取公司信息
 */
  getCompany: function () {
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
        console.log(res);
        if (res.data.result) {
          that.setData({
            cmpInfo: res.data.result
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }

})