// pages/employee/senior-executive/addBoss/index.js、
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    staffList:[],
    id:null,
    checkId:null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  getStaffList:function(){
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
        if (res.data.result) {
          for (let i = 0; i < res.data.result.employee.length; i++) {
            res.data.result.employee[i].first_name = res.data.result.employee[i].employee_name.substring(0,1);
          }
          that.setData({
            staffList: res.data.result
          })
        }
        
      }
    })
  },
  selectBoss:function(e){
    var _this = this;
    console.log(e)
    _this.setData({
      checkId:e.currentTarget.id,
      id:e.currentTarget.dataset.id//union_id
    })
    setTimeout(function(){
      wx.navigateTo({
        url: '/pages/employee/senior-executive/fillName/index?id='+_this.data.id
      })  
    },1000)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    this.setData({
      checkId:null
    })
    this.getStaffList();
  },

})