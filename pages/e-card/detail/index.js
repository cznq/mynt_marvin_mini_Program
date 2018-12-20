const app = getApp();
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
    avatar: wx.getStorageSync('avatar'),
    error_msg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    if (options.invitation_id) {
      that.data.invitation_id = options.invitation_id;
      that.setData({
        title: '访客电梯卡',
        qrcode_tips: '该码30分钟内有效，请勿泄露。'
      })
      wx.setNavigationBarTitle({
        title: '访客电梯卡',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '员工电梯卡'
      })
    }
    
  },

  getFloorQrcode() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'building',
        method: 'get_floor_qrcode',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: that.data.invitation_id
        })
      },
      success: res => {
        console.log(res.data);
        if (res.data.result) {
          that.setData({
            floor_qrcode_url: res.data.result.qrcode_url
          })
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
        that.getFloorQrcode();
      }
    })
  },

  /**
   * 获取邀请信息
   */
  getInitation: function () {
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
  onShow: function () {

    if (this.data.invitation_id) {
      this.getInitation();
    } else {
      this.getCompany();
    }
  }

})