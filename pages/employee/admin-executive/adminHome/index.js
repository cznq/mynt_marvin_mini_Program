// pages/employee/admin-executive/adminHome/index.js
var toast = require('../../../../templates/showToast/showToast');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnType: '',
    selfRole: null,
    active: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.union_id = options.union_id;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            selfRole: res.data.result.role
          });
        }
      }
    })
    that.getEmployeeInfo();
  },

  getEmployeeInfo() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          employee_union_id: that.data.union_id
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            empInfo: res.data.result
          });
        }
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'company',
            method: 'get_info',
            data: JSON.stringify({
              union_id: wx.getStorageSync('xy_session'),
            })
          },
          success: res => {
            if (res.data.result) {
              that.setData({
                compInfo: res.data.result
              });
            }

          }
        })

      }
    })
  },

  bindToastSure: function () {
    var _this = this;
    
    if (_this.data.btnType == 'unbind') {
      toast.hideToast(_this, {
        cb: function () {
          app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
              service: 'company',
              method: 'unbind_employee',
              data: JSON.stringify({
                union_id: wx.getStorageSync('xy_session'),
                employee_union_id: _this.data.union_id
              })
            },
            success: res => {
              if (res.data.sub_code == 0) {
                wx.navigateBack({});
              } else {
                toast.showToast(_this, {
                  toastStyle: 'toast',
                  title: res.data.sub_msg,
                  duration: 2000,
                  mask: false,
                  cb: function () { }
                });
              }

            }
          })

        }
      });
    } 
  },
  bindToastClose: function () {
    toast.hideToast();
  },
  /**
   * 重新发送邀请
   */
  reInviteFront() {
    var that= this;
    wx.navigateTo({
      url: '../adminShare/index?invitation_id=' + that.data.empInfo.role_invitation_id + '&from=inviteFront',
    })
  },

  unbindStaff: function () {
    var self = this;
    this.data.btnType = 'unbind';
    toast.showToast(this, {
      toastStyle: 'toast4',
      title: '解绑员工',
      introduce: '确定要解绑该员工吗？',
      mask: true,
      isSure: true,
      sureText: '确定',
      isClose: true,
      closeText: '取消'
    });
  }

})