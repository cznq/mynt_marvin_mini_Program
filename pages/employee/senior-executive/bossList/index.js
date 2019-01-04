// pages/employee/senior-executive/bossList/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    staffList:[],
    bossNum:3,
    btnShow:false,
    bossName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
        })
      },
      success: res => {
        console.log(res);

      }
    })
  },
  /**
   * 获取员工列表数据
   * first_name  员工列表的姓
   * last_name 员工列表的名字
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
        if (res.data.result) {
          for (let i = 0; i < res.data.result.employee.length; i++) {
            res.data.result.employee[i].first_name = res.data.result.employee[i].employee_name.substring(0,1);
            if(res.data.result.employee[i].role == 2){
              that.setData({
                bossNum: that.data.bossNum-1
              })
              if(that.data.bossNum == 0){
                that.setData({
                  btnShow:true
                })
              }
            }
          }
          that.setData({
            staffList: res.data.result
          })
        }
        
      }
    })
  },
  onShow: function () {
    this.getBossList();
  },
  goSelect:function(){
    wx.navigateTo({
      url: '/pages/employee/senior-executive/addBoss/index',
    })
  }
})