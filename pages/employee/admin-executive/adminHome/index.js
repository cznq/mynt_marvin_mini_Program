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
    //that.data.union_id?that.data.union_id: options.union_id;
    that.data.union_id = options.union_id;
    that.data.unactive = options.unactive;
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

  /**
   * 转让管理员
   */
  transAdmin: function() {
    var self = this;
    this.data.btnType = 'trans';
    toast.showToast(this, {
      toastStyle: 'toast8',
      title: '确定转让管理员权限吗？',
      introduce: '1、转让需要待对方确认接受后才能生效;\n2、对方确认后您将不再具备公司管理权限；\n3、请敦促对方尽快完成接受，以免造成机器人接待工作的中断。',
      mask: true,
      isSure: true,
      sureText: '确定',
      isClose: true,
      closeText: '取消'
    });
  },

  /**
   * 删除前台
   */
  removeFrontDesk: function() {
    var self = this;
    this.data.btnType = 'remove';
    toast.showToast(this, {
      toastStyle: 'toast4',
      title: '删除前台（子管理员）',
      introduce: '确定要删除该前台的职务吗？',
      mask: true,
      isSure: true,
      sureText: '确定',
      isClose: true,
      closeText: '取消'
    });
    
  },
  bindToastSure: function () {
    var _this = this;
    if (_this.data.btnType =='trans') {
      toast.hideToast();
      wx.navigateTo({
        url: '../../staff-choose-list/index?from=transAdmin'
      })
      return ;
    } 
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
                toast.showToast(this, {
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
    } else if (_this.data.btnType == 'remove') {

      toast.hideToast(_this, {
        cb: function () {
          app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
              service: 'company',
              method: 'update_employee_role',
              data: JSON.stringify({
                employee_union_id: _this.data.union_id,
                role: 1
              })
            },
            success: res => {
              if (res.data.sub_code == 0) {
                _this.getEmployeeInfo();
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                })
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
      url: '../adminShare/index?unionId=' + that.data.union_id + '&from=inviteFront',
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