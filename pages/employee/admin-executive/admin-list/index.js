var toast = require('../../../../templates/showToast/showToast');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: null,  
    role: '',
    edit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

  },

  /**
   * 获取员工列表数据
   * first_name  员工列表的姓
   * last_name 员工列表的名字
   */
  getStaffList: function () {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_list',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
  
        if (res.data.result) {
          that.setData({
            staffList: res.data.result
          })
        }

      }
    })
  },

  /**
   * 转让管理员
   */
  transAdmin: function (e) {
    console.log(e);
    var self = this;
    this.data.btnType = 'trans';
    this.data.role_invitation_id = e.currentTarget.dataset.roleInvitationId;
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
   * 删除前台记录
   */
  removeFrontApply: function (e) {
    var that = this;
    this.data.role_invitation_id = e.currentTarget.dataset.roleInvitationId;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'cancel_role_invitation',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: that.data.role_invitation_id
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {
          wx.redirectTo({
            url: '../admin-list/index',
          })
        }
      }
    })
  },

  /**
   * 删除前台
   */
  removeFrontDesk: function (e) {
    var self = this;
    this.data.btnType = 'remove';
    this.data.role_invitation_id = e.currentTarget.dataset.roleInvitationId;
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
    if (_this.data.btnType == 'trans') {
      if (_this.data.empInfo.role_invitation_id != 0) {
        toast.hideToast();
        wx.navigateTo({
          url: '../adminShare/index?invitation_id=' + _this.data.role_invitation_id + '&from=inviteFront',
        })
      } else {
        toast.hideToast();
        wx.navigateTo({
          url: '../../staff-choose-list/index?from=transAdmin'
        })
      }
      return;
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
                wx.navigateBack();
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

  editAdminList: function() {
    if (this.data.edit) {
      this.setData({ edit: false })
    } else {
      this.setData({ edit: true })
    }
    
  },

  onShow: function () {
    this.getStaffList();
  }


})