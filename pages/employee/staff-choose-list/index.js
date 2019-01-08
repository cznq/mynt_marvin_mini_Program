// pages/employee/senior-executive/addBoss/index.js、
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    staffList:[],
    unionId:null,
    personType:null,
    from:''
  },

  /**
   * 生命周期函数--监听页面加载
   * options.from   transAdmin 转让管理员; inviteFront 邀请子管理员; inviteLeader 邀请高管
   */
  onLoad: function (options) {
    this.setData({
      from: options.from
    })
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
      unionId:e.currentTarget.dataset.id,//union_id
      personType:e.currentTarget.dataset.type
    })
    if (_this.data.personType == 3) {
      return false;
    } else {
      console.log(this.data.unionId)
      if (_this.data.from == 'inviteLeader') {
        setTimeout(function(){
          wx.navigateTo({
            url: '/pages/employee/senior-executive/fillName/index?unionId='+_this.data.unionId
          })  
        },1000)
      } else {
        
      }

    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    this.getStaffList();
  },

})