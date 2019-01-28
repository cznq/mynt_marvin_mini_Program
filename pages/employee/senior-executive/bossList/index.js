// pages/employee/senior-executive/bossList/index.js
var toast = require('../../../../templates/showToast/showToast');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    version: app.globalData.version,
    staffList: null,//员工数组
    leaderList:null,//高管数组
    limit_count:'',//可设置的高管数量
    isNull:true,
    showRemove:false, //显示移除按钮
    union_id:'',
    invite_status:'',
    role_invitation_id:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.limit_count<0){ //-1不限制 默认3
      this.setData({
        limit_count:'3'
      }) 
    }else{
      this.setData({
        limit_count:options.limit_count
      })
    }
    this.getBossList();
  },
  /**
   * 获取员工列表数据
  */
  getBossList: function () {
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
        console.log(res.data.result);
        if(res.data.result){  
          that.setData({
            leaderList:res.data.result.leader,
          })   
          if(that.data.leaderList.length == 0){
            wx.showToast({
              icon: 'none',
              title: '暂无高管可以管理'
            })
          }
          if (that.data.leaderList.length >= that.data.limit_count) {
            that.setData({             
              isNull:false,
            })
          }else{
            that.setData({             
              isNull:true
            })
          }
        }
      }
    })
  },
  onShow: function () {
  },
  //管理高管
  manage:function(){
    this.setData({
      showRemove:!this.data.showRemove
    }) 
  },
  remove:function(e){
    var that = this;
    that.setData({             
      union_id:e.currentTarget.dataset.id,
      invite_status :e.currentTarget.dataset.status,
      role_invitation_id:e.currentTarget.dataset.invitation
    })
    toast.showToast(this, {
      toastStyle: 'toast2',
      title: '移除该高管',
      introduce: '是否确认移除该高管的权限？',
      mask: true,
      isSure: true,
      sureText: '确定',
      isClose: true,
      closeText: '取消'
    });
  },
  //取消关闭弹层
  bindToastClose: function() {
    toast.hideToast();
  },
  //确定移除高管
  bindToastSure: function() {
      var that = this;
      if (that.data.invite_status == 0) {//待激活
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'company',
            method: 'cancel_role_invitation',
            data: JSON.stringify({
              union_id: wx.getStorageSync('xy_session'),
              invitation_id:that.data.role_invitation_id,
            })
          },
          success: res => {
            console.log(res.data);
            if(res.data.sub_code == 0){
              toast.hideToast();
              that.getBossList();
            }
          }
        })
        
      } else if(that.data.invite_status == 1)  {//已激活
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'company',
            method: 'remove_leader',
            data: JSON.stringify({
              leader_union_id:that.data.union_id,
              union_id: wx.getStorageSync('xy_session')
            })
          },
          success: res => {
            console.log(res.data);
            if(res.data.sub_code == 0){ 
              toast.hideToast();
              that.getBossList();
            }
          }
        })
      }
  },
  //去选择员工
  goSelect:function(e){
    wx.navigateTo({
      url: '/pages/employee/staff-choose-list/index?from='+e.currentTarget.dataset.from,
    })
  },
 
})