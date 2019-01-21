var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    initeType:'all',
    allTime:false,
    seleTime:'allTime',
    noneData:{
      buttonText:'邀请访客',
      textInfo:'暂无邀请',
      show:false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.get_employee_status();
  },
  //获取用户状态
  get_employee_status: function() {
      app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
              service: 'company',
              method: 'get_employee_info',
              data: JSON.stringify({})
          },
          success: res => {
            console.log('相应:',res);
            let data = res.data;
            if (data.sub_code === 0) {
              switch (data.result.role) {//0:角色待定,1:普通职员,2:前台,3:公司管理员
                case 0:
                  wx.redirectTo({
                      url: '/pages/manage/manage'
                    })
                  break;
                case 1:

                  break;
                case 2:

                  break;
                case 3:

                  break;
                default:

              }
            }else{
                wx.redirectTo({
                    url: '/pages/manage/manage'
                  })
            }



          },
          fail: res => {
              console.log('fail');
          }
      })
  },
  headTab:function(e){
    console.log(e.target.dataset.name);
    let name = e.target.dataset.name;
    this.setData({
      initeType:name
    })
  },
  allTimeState:function() {
    let allTime = this.data.allTime;
    if (allTime) {
      this.setData({
        allTime:false
      })
    }else {
      this.setData({
        allTime:true
      })
    }
  },
  seleTime:function(e) {
    let seleTime = e.target.dataset.name;
    this.setData({
      seleTime:seleTime
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
