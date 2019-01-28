var toast = require('../../../../templates/showToast/showToast');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textInfo: '',
    roleTitle: '',
    invitation_id: null,
    hasAccept: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.data.invitation_id = options.invitation_id;
    that.data.invitation_type = options.invitation_type;
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
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            role: res.data.result.role
          });
        }
        that.getRoleInvitation(that.data.invitation_id, that.data.invitation_type);
      }
    })
  },

  /**
   * 获取邀请信息
   */
  getRoleInvitation(invitation_id, invitation_type) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_role_invitation_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: invitation_id,
          invitation_type: invitation_type
        })
      },
      success: res => {
        console.log(res);
        if (res.data.result) {
          that.setData({
            invitation: res.data.result
          })
          if (res.data.result.assigned_role == that.data.role && res.data.result.invitee_union_id == wx.getStorageSync('xy_session')) {
            that.setData({ hasAccept: true })
          }
          if (res.data.result.assigned_role == 3) {
            this.setData({
              textInfo: '很高兴邀请您成为本公司新的管理员，您将拥有我们的以下管理权力，烦请点击下方按钮接受邀请并开始使用管理权力。',
              roleTitle: '管理员'
            })
          } else if (res.data.result.assigned_role == 2) {
            this.setData({
              textInfo: '很高兴邀请您成为本公司的前台(子管理员)，您将拥有我们的以下管理权力，烦请点击下方按钮接受邀请并开始使用管理权力。',
              roleTitle: '前台(子管理员)'
            })
          }
        }

      }
    })
  },

  receiveInvitation() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'accept_role_invitation',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          role_invitation_id: that.data.invitation_id
        })
      },
      showLoading: false,
      success: res => {
        console.log(res.data.sub_code);
        if (res.data.sub_code ==0) {
          that.getEmployeeInfo();
        } else {
          toast.showToast(this, {
            toastStyle: 'toast',
            title: res.data.sub_msg,
            duration: 2000,
            mask: false,
            cb: function () {}
          });
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