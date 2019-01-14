// pages/employee/senior-executive/bossList/index.js
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
    btnShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      limit_count:options.limit_count
    })   
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
          let n = that.data.limit_count - res.data.result.leader.length;
          that.setData({
            leaderList:res.data.result.leader,
            setNum:n
          })   
          if (that.data.setNum == 0) {
            that.setData({
              btnShow: true
            })
          } 
        }
      }
    })
  },
  onShow: function () {
  },
  goSelect:function(e){
    wx.navigateTo({
      url: '/pages/employee/staff-choose-list/index?from='+e.currentTarget.dataset.from,
    })
  },
})