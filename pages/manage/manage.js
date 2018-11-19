var app = getApp()
Page({
  data: {
    indicatorDots: true, //是否显示面板指示点
    indicatorColor: "#8891A9", //指示点颜色
    indicatorActiveColor: "#007BFF", //当前选中的指示点颜色
    autoplay: true, //是否自动切换
    interval: 2000, //自动切换时间间隔
    duration: 500, //滑动动画时长
    circular: true, //是否采用衔接滑动
    islogin: false,//创建公司&&加入公司首页
    isexamine: false,//审核中
    ismanage: false,//管理中心
    headlinesT1: "欢迎使用",
    headlinesT2: "小觅楼宇服务",
    copy: '我的公司还未入驻小觅楼宇服务，点击 ',
    copy2: '创建公司',
    button_text: '加入公司',
    button_text_qx: '取消申请',
    imgUrls: [{
      url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      title: '优享智能服务',
      content: '享受机器人贴心服务，\n颠覆传统解放人力'
    },
    {
      url: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      title: '线上访客邀请',
      content: '通过线上邀请访客，到访流程\n更加便捷高效'
    },
    {
      url: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      title: '商户协议买单',
      content: '享受周边商户专属协议优惠，\n升级消费体验'
    }
    ],
    mode: 'aspectFill',//manage logo展示效果
    application:[
      {
        url:'',
        pic:'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/manage/m1.png',
        name:'公司信息'
      }, {
        url: '',
        pic: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/manage/m2.png',
        name: '员工信息'
      }
      , {
        url: '',
        pic: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/manage/m3.png',
        name: '访客列表'
      }, {
        url: '',
        pic: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/manage/m4.png',
        name: '邀请列表'
      }, {
        url: '',
        pic: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/manage/m5.png',
        name: 'VIP列表'
      }, {
        url: '',
        pic: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/manage/m6.png',
        name: '前台列表'
      }
    ],
    vipImg:'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/vip@2x.png',
    service:[
      {
        url: '',
        pic: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/manage/m7.png',
        text1: '自动值守',
        text2: '未开启 >',
        backgroundColor: '#F5F5FF'
      }, {
        url: '',
        pic: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/manage/m8.png',
        text1: '员工取卡',
        text2: '未开启 >',
        backgroundColor:'#F0FAF7'
      }
    ]
  },
  onLoad: function(options) {
    var _this = this;
    //检测登陆
    if (!(app.checkSession()) || wx.getStorageSync('open_id') == '' || wx.getStorageSync('xy_session') == '') {
      app.checkLogin().then(function(res) {
        var union_id = wx.getStorageSync('xy_session');
        _this.get_review_status(_this, union_id);
      })
    } else {
      var union_id = wx.getStorageSync('xy_session');
      _this.get_review_status(_this, union_id);
    }
  },
  //获取用户状态
  get_review_status: function(_this, union_id) {
    if (union_id !== '') {
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'get_review_status',
          data: JSON.stringify({
            union_id: union_id
          })
        },
        success: res => {
          console.log(res);
          var resdata = res.data.result;
          //resdata.employee_status = 0;
          if (res.data.sub_code == 0) {
            if (resdata.employee_status === 0) {
              console.log('管理中心');
              _this.setData({
                ismanage: true
              })

              wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#092344',
                animation: {
                  duration: 400,
                  timingFunc: 'easeIn'
                }
              })
            }
            if (resdata.employee_status === 2) {
              console.log('审核中页面');
              _this.setData({
                isexamine: true,
                company_name: resdata.company_name,
                name: resdata.name
              })
            }
            if (resdata.employee_status === "" || resdata.employee_status === 1 || resdata.employee_status === 3 || resdata.employee_status === 4) {
              console.log('创建&&加入公司首页');
              _this.setData({
                islogin: true
              })
            }

          } else {
            console.log(res.data.sub_msg);
          }
        },
        fail: res => {
          console.log('fail');
        }
      })
    } else {
      wx.showToast({
        title: '授权失败，请从新登陆',
        icon: 'none',
        duration: 10000
      })
    }
  },
  //加入公司
  joinCompany: function() {
    wx.navigateTo({
      url: '../employee/join-company/choiceJoin/index'
    })
  },
  //创建公司
  createCompany: function() {
    wx.navigateTo({
      url: '../create-company/enterCompanyCode/index',
    })
  },
  //取消申请
  withdraw: function() {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'cancel_apply',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        //取消成功
        if (res.data.sub_code == 0) {
          wx.reLaunch({
            url: '../manage/manage',
          })
        } else {
          wx.showToast({
            title: '取消失败',
            icon: 'none',
            duration: 3000
          })
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  }
})