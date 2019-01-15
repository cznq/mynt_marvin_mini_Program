// pages/employee/admin-executive/adminShare/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textInfo: '很高兴邀请您成为本公司新的管理员，您将拥有我们的以下管理权力，烦请点击下方按钮接受邀请并开始使用管理权力。',
    roleTitle: '管理员',
    changeRole: 3,
    inviteInfo: null,
    cancelTrans: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.invitation_id) {
      that.setData({
        cancelTrans: true,
        invitation_id: options.invitation_id
      })
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'get_role_invitation_info',
          data: JSON.stringify({
            union_id: wx.getStorageSync('xy_session'),
            invitation_id: that.data.invitation_id,
            invitation_type: 0
          })
        },
        success: res => {
          if (res.data.result) {
            if (res.data.result.assigned_role==2) {
              this.setData({
                textInfo: '很高兴邀请您成为本公司的前台(子管理员)，您将拥有我们的以下管理权力，烦请点击下方按钮接受邀请并开始使用管理权力。',
                roleTitle: '前台(子管理员)',
                changeRole: 2
              })
            }
            that.setData({
              inviteInfo: res.data.result
            });
          }
        }
      })
    } else {
      if(options.from == 'transAdmin') {
        this.setData({
          textInfo: '很高兴邀请您成为本公司新的管理员，您将拥有我们的以下管理权力，烦请点击下方按钮接受邀请并开始使用管理权力。',
          roleTitle: '管理员',
          changeRole: 3,

        })
      } else if(options.from == 'inviteFront') {
        this.setData({
          textInfo: '很高兴邀请您成为本公司的前台(子管理员)，您将拥有我们的以下管理权力，烦请点击下方按钮接受邀请并开始使用管理权力。',
          roleTitle: '前台(子管理员)',
          changeRole: 2
        })
      }
      
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
              'inviteInfo.inviter_name': res.data.result.name
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
                  'inviteInfo.company_id': res.data.result.company_id,
                  'inviteInfo.company_code': res.data.result.company_code,
                  'inviteInfo.company_logo': res.data.result.logo,
                  'inviteInfo.company_name': res.data.result.company_name,
                  'inviteInfo.company_short_name': res.data.result.company_short_name
                });
              }
              that.getInviteeInfo(options.unionId);
            }
          })
        }
      })
    }

  },
  /**
   * 提交邀请信息
   */
  submitInvitation(inviter_name, invitee_union_id, invitee_name, assigned_role, invitation_type, company_id) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'role_invitation_record',
        data: JSON.stringify({
          inviter_union_id: wx.getStorageSync('xy_session'),
          inviter_name: inviter_name,
          invitee_union_id: invitee_union_id,
          invitee_name: invitee_name,
          assigned_role: assigned_role,
          invitation_type: invitation_type,
          company_id: company_id
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            invitation_id: res.data.result.invitation_id
          });
        }

      }
    })
  },

  cancelTrans: function() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'cancel_role_invitation',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: that.data.invitation_id
        })
      },
      success: res => {
        if (res.data.sub_code==0) {
          wx.redirectTo({
            url: '../admin-list/index',
          })
        }
      }
    })
  },

  backAction: function() {
    wx.navigateBack({})
  },

  /**
   * 获取被邀请人信息
   */
  getInviteeInfo(employee_union_id) {
    /** 获取员工信息 **/
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          employee_union_id: employee_union_id
        })
      },
      success: res => {
        console.log('被邀请人信息');
        console.log(res.data.result);
        if (res.data.result) {
          that.setData({
            'inviteInfo.invitee_name': res.data.result.name
          });
          that.submitInvitation(that.data.inviteInfo.inviter_name, employee_union_id, res.data.result.name, that.data.changeRole, 0, that.data.inviteInfo.company_id);
        }

      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareTitle = that.data.changeRole == 2 ?'成为该公司前台':'成为该公司的管理员';
    return {
      title: that.data.inviteInfo.inviter_name + '邀请' + that.data.inviteInfo.invitee_name + shareTitle,
      path: '/pages/employee/admin-executive/adminReceive/index?invitation_id=' + that.data.invitation_id + '&invitation_type=0',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})