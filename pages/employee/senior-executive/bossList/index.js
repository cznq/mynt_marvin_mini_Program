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
    staffList: null,
    leaderList:null,
    limit_count:'',
    setNum:'',
    isNull:true,
    showRemove:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      limit_count:options.limit_count
    })   
    this.getBossList();
    console.log(this.data.isNull)
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
          if (that.data.leaderList.length == 3) {
            that.setData({             
              isNull:false,
            })
          }else{
            that.setData({             
              isNull:true,
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
    let union_id = e.currentTarget.dataset.id;
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
  //去选择员工
  goSelect:function(e){
    wx.navigateTo({
      url: '/pages/employee/staff-choose-list/index?from='+e.currentTarget.dataset.from,
    })
  },
})