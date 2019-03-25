var app = getApp()
Page({
  data: {
    isiphoneX: app.globalData.isIphoneX,
    swiperCurrent: 0,
    showLoginModal: false,
    indicatorDots: true, //是否显示面板指示点
    indicatorColor: "#8891A9", //指示点颜色
    indicatorActiveColor: "#007BFF", //当前选中的指示点颜色
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 500, //滑动动画时长
    circular: true, //是否采用衔接滑动
    islogin: false, //创建公司&&加入公司首页
    ismanage: false, //管理中心
    islock: true,
    role: '',
    headlinesT1: "欢迎使用",
    headlinesT2: "小觅楼宇服务",
    copy: '我的公司还未入驻小觅楼宇服务，点击 ',
    copy2: '创建公司',
    button_text: '加入公司',
    button_text_qx: '取消申请',
    mode: 'aspectFill', //manage logo展示效果
    cd: {},
    businessVip_status: 0,
    imgurl_manage: [],
    imgUrls: [{
        url: app.globalData.BASE_IMG_URl + 'welcome_one@2x.png',
        title: '优享智能服务',
        content: '享受机器人贴心服务，\n颠覆传统解放人力'
      },
      {
        url: app.globalData.BASE_IMG_URl + 'welcome_two@2x.png',
        title: '线上访客邀请',
        content: '通过线上邀请访客，到访流程\n更加便捷高效'
      },
      {
        url: app.globalData.BASE_IMG_URl + 'welcome_three@2x.png',
        title: '商户协议买单',
        content: '享受周边商户专属协议优惠，\n升级消费体验'
      }
    ],
    application: [{
      url: '',
      pic: app.globalData.BASE_IMG_URl + 'manage/m1.png',
      name: '企业信息',
      bindtap: 'editCompanyPages',
      isShow: true,
      news: false
    }, {
      url: '',
      pic: app.globalData.BASE_IMG_URl + 'manage/m2.png',
      name: '员工信息',
      bindtap: 'staffList',
      isShow: true,
      news: false
    }, {
      url: '',
      pic: app.globalData.BASE_IMG_URl + 'manage/m4.png',
      name: '邀请记录',
      bindtap: 'invite',
      isShow: true,
      news: false
    }, {
      url: '',
      pic: app.globalData.BASE_IMG_URl + 'manage/m3.png',
      name: '访客列表',
      bindtap: 'visitor',
      isShow: true,
      news: false
    }, {
      url: '',
      pic: app.globalData.BASE_IMG_URl + 'manage/m9.png',
      name: '企业月报',
      bindtap: '',
      isShow: false,
      news: false
    }, {
      url: '',
      pic: app.globalData.BASE_IMG_URl + 'manage/m10.png',
      name: '自动值守',
      bindtap: 'unattendedSetting',
      isShow: true,
      news: false
    }],
    server_input_pic_url: '',
    serviceStatus: '',
    isSwiperText: [true, false, false] //轮播文案
  },
  onLoad: function(options) {
    var _this = this;
    _this.get_review_status(_this); //获取用户状态
    _this.data.islock = false;
  },
  onShow: function() {
    var _this = this;
    if (_this.data.islock) {
      _this.get_review_status(_this); //获取用户状态
    }
    _this.data.islock = true;
  },
  swiperChange: function(e) {
    var _this = this;
    _this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //获取用户状态
  get_review_status: function(_this) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_review_status',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log('get_review_status API return:', res);
        var resdata = res.data.result;
        if (res.data.sub_code == 0) {
          if (resdata.employee_status === 0) {
            _this.setData({
              role: resdata.role
            });
            _this.setData({
              islogin: false,
              ismanage: true
            })
            //普通员工
            if (resdata.role == 2 || resdata.role == 3) {
              _this.setData({
                'application[5].isShow': true //自动值守
              })
            } else {
              _this.setData({
                'application[5].isShow': false //自动值守
              })
            }
            _this.get_info(); //获取企业信息
            _this.get_rotation_chart(_this); //获取轮播图
          } else {
            _this.setData({
              islogin: true,
              ismanage: false,
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
  //管理中心-企业应用-公司信息
  editCompanyPages: function() {
    var _this = this;
    wx.navigateTo({
      url: '../create-company/editCompanyPages/index?role=' + _this.data.role
    })
  },
  //员工信息
  staffList: function() {
    wx.navigateTo({
      url: '../employee/staff-list/index'
    })
  },
  //访客列表
  visitor: function() {
    wx.navigateTo({
      url: '../visitor-list/list/index'
    })
  },
  //邀请列表
  invite: function() {
    wx.navigateTo({
      url: '../invite-list/index/index'
    })
  },
  //自动值守
  unattendedSetting: function() {
    var that = this;
    if (that.data.cd.attend_status == 0) {
      wx.navigateTo({
        url: '/pages/company/unattended-setting/setHome/index',
      })
    } else if (that.data.cd.attend_status == 1) {
      wx.navigateTo({
        url: '/pages/company/unattended-setting/setting/index',
      })
    }
  },
  //邀请访客
  inviteVisitor: function() {
    wx.navigateTo({
      url: '/pages/invite-visitor/start/index',
    })
  },
  //员工福利
  suiteIntroduce: function() {
    wx.navigateTo({
      url: '/benifit/pages/vip-card/vip-card',
    })
  },
  //创建公司-轮播图文案信息
  intervalChange: function(e) {
    var _this = this;
    for (var key in _this.data.isSwiperText) {
      if (key == e.detail.current) {
        _this.setData({
          ["isSwiperText[" + e.detail.current + "]"]: true
        })
      } else {
        _this.setData({
          ["isSwiperText[" + key + "]"]: false
        })
      }
    }
  },
  //请求企业信息
  get_info: function() {
    var _this = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      showLoading: false,
      success: res => {
        //员工提示信息
        if (res.data.result.apply_number > 0) {
          _this.setData({
            'application[1].news': true
          })
        } else {
          _this.setData({
            'application[1].news': false
          })
        }
        if (res.data.sub_code == 0) {
          _this.setData({
            cd: res.data.result
          })
        } else {
          console.log(res.data.sub_msg);
        }
        _this.getServiceStatus(_this);
      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  /**
   * 获取商业服务套件的状态
   */
  getServiceStatus: function(that) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_business_service_suite_status',
        data: JSON.stringify({}),
      },
      success: res => {
        // console.log("商业服务套件的状态:", res);
        if (res.data.return_code === "SUCCESS") {
          let data = res.data
          that.setData({
            businessVip_status: data.result.business_service_suite_status,
          })

        }

      }
    })
  },
  //获取轮播图
  get_rotation_chart: function(_this) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_rotation_chart',
        data: JSON.stringify({
          location_type: 0
        })
      },
      showLoading: false,
      success: res => {
        if (res.data.result) {
          _this.setData({
            imgurl_manage: res.data.result
          })
        } else {
          //默认轮播图
          _this.setData({
            imgurl_manage: [{
              'image_url': 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/slide-default.png',
              'link_url': '/pages/businessService/suite-introduce/suite-introduce'
            }]
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