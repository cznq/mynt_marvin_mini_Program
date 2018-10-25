// pages/manage/manage.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin: false,
    isexamine: false,
    iswebview: false,
    timestamp: null,
    web_url: app.globalData.WEB_VIEW_URL,
    title: '欢迎使用小觅楼宇服务',
    introduce: '加入一个公司并开始享受高端楼宇服务，包括邀请访客、员工快速发卡等',
    copy: '公司还未入驻. ',
    copy2: '新建公司',
    button_text: '加入公司',
    button_text_qx: '取消申请'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    
    //检测登陆
    if (!(app.checkSession())) {
      app.checkLogin().then(function(res) {})
    } else {}

    //获取员工信息
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({})
      },
      success: res => {
        var resdata = res.data.result;
        console.log(resdata);
        /*======= test data =======*/
        resdata.role = 0;
        resdata.employee_status = '';
        /*======= test data =======*/
        if (resdata) {
          if (resdata.role == 0 && resdata.employee_status == '') {
            console.log('小机器人');
            that.setData({
              islogin: true
            })
          } else if (resdata.role == 0 && resdata.employee_status == 2) {
            console.log('审核中页面');
            that.setData({
              isexamine: true,
              company_name: resdata.company_name,
              name: resdata.name
            })
          } else {
            console.log('webview');
            that.setData({
              iswebview: true
            })
          }
        }
      }
    })
  },
  //加入公司
  joinCompany:function(){
    wx.navigateTo({
      url: '../employee/join-company/choice/index'
    })
  },
  //创建公司
  createCompany:function(){
    wx.navigateTo({
      url: '../create-company/code/index',
    })
  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  }
})