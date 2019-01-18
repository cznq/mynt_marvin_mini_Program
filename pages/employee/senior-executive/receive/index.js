// pages/employee/senior-executive/receive/index.js
var toast = require('../../../../templates/showToast/showToast');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    version: app.globalData.version,
    invitation_id: null,
    invitation: null,
    hasAccepted: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      invitation_id:options.invitation_id
    })
  },
  getInitation: function () {
    var that = this;
    if (that.data.invitation_id == undefined) {
      wx.showToast({
        title: '没有获取到邀请信息',
        icon: 'none'
      })
      return ;
    }
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_role_invitation_info',
        data: JSON.stringify({
          invitation_id: that.data.invitation_id,
          invitation_type:0//角色邀请
        })
      },
      success: res => {
        if(!res.data.result) {
          wx.showToast({
            title: '没有获取到邀请信息',
            icon: 'none'
          })
        } else {
          that.setData({
            invitation: res.data.result,
          })
        }
       
        //获取职员信息 判断person_type是否为高管 是=已接受
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'company',
            method: 'get_employee_info',
            data: JSON.stringify({
              union_id:wx.getStorageSync('xy_session'),
            })
          },
          success: res => {
            console.log(res.data.result);
            if (res.data.result && res.data.result.person_type == 3 && that.data.invitation.invitee_union_id == wx.getStorageSync('xy_session')) {
              that.setData({
                hasAccepted: true,
              })
            }      
          }
        })
      },
      fail: res => {
        wx.showToast({
          title: '没有获取到邀请信息',
          icon: 'none'
        })
      }
    })
  },
  receiveSubmit:function(){
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'give_employee_title',
        data: JSON.stringify({
          union_id:wx.getStorageSync('xy_session'),
          role:4, //员工角色(4:高管)
          invitation_id:that.data.invitation_id
        }),
        isloading: false
      },
      success: res => {
        console.log(res.data.sub_msg);
        if (res.data.sub_code == 0) {//success
          that.setData({
            hasAccepted:true,
          });
        } else {
          toast.showToast(that, {
            toastStyle: 'toast',
            title: res.data.sub_msg,
            duration: 2000,
            mask: false,
            cb: function () { }
          });
        }     
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInitation();
  },


})