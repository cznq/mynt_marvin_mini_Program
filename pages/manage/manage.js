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
    interval: 100000, //自动切换时间间隔
    duration: 500, //滑动动画时长
    circular: true, //是否采用衔接滑动
    islogin: false, //创建公司&&加入公司首页
    //isexamine: false, //审核中
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
    imgurl_manage:[
      {
        url: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/test1.png',
        title: '',
        bindtap: ''
      },
      {
        url: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/test1.png',
        title: '',
        bindtap: ''
      },
      {
        url: 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/test1.png',
        title: '',
        bindtap: ''
      }
    ],
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
      news:'2'
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
      isShow: true,
        news: false
    }, {
      url: '',
      pic: app.globalData.BASE_IMG_URl + 'manage/m10.png',
      name: '邀请值守',
      bindtap: '',
      isShow: true,
      news: false
    }],
    server_input_pic_url: '',
    serviceStatus: '',
    isSwiperText:[true,false,false]//轮播文案
  },
  onLoad: function(options) {
    var _this = this;
    _this.get_review_status(_this);//获取用户状态
    _this.data.islock = false;
  },
  onShow: function() {
    var _this = this;
    if (_this.data.islock) {
      _this.get_review_status(_this);//获取用户状态
    }
    _this.data.islock = true;

  },
  swiperChange: function (e) {
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
        var resdata = res.data.result;
        if (res.data.sub_code == 0) {
          if (resdata.employee_status === 0) {
            console.log('管理中心');
            _this.data.role = resdata.role;
            _this.setData({
              islogin: false,
              //isexamine: false,
              ismanage: true
            })
            // /* ----- 企业应用显示权限 ----- */
            // if (resdata.role == 1) {
            //   //普通员工
            //   _this.setData({
            //     'application[4].isShow': false, //vip列表
            //     'application[5].isShow': false //前台列表
            //   })
            // }
            // if (resdata.role == 2) {
            //   //前台
            //   _this.setData({
            //     'application[5].isShow': false //前台列表
            //   })
            // }


            //获取企业信息
            _this.get_info();

          }

          if (resdata.employee_status === "" || resdata.employee_status === 1 || resdata.employee_status === 3 || resdata.employee_status === 4) {
            console.log('创建&&加入公司首页');
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
    var _this = this;
    wx.navigateTo({
      url: '../employee/join-company/choiceJoin/index'
    })

  },
  //创建公司
  createCompany: function() {
    var _this = this;
    wx.navigateTo({
      url: '../create-company/enterCompanyCode/index',
    })

  },
  //取消申请
  /*
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
  },
  */

  //管理中心-企业应用-公司信息
  editCompanyPages: function() {
    var _this = this;
    wx.navigateTo({
      url: '../create-company/editCompanyPages/index?role=' + _this.data.role
    })
  },
  //管理中心-企业应用-员工信息
  staffList: function() {
    wx.navigateTo({
      url: '../employee/staff-list/index'
    })
  },
  //管理中心-企业应用-访客列表
  visitor: function() {
    wx.navigateTo({
      url: '../company/webview/index?page=visitor'
    })
  },
  //管理中心-企业应用-邀请列表
  invite: function() {
    wx.navigateTo({
      url: '../company/webview/index?page=invite'
    })
  },
  //管理中心-企业服务-自动值守
  /*
  unattendedSetting: function() {
    var _this = this;
    wx.navigateTo({
      url: _this.data.service[0].url
    })
  },
  //管理中心-企业服务-员工取卡
  takeCard: function() {
    var _this = this;
    wx.navigateTo({
      url: _this.data.service[1].url
    })
  },
  */
  //轮播图文案信息
  intervalChange:function(e){
    var _this = this;
    for (var key in _this.data.isSwiperText) {
      if (key == e.detail.current){
        _this.setData({
          ["isSwiperText[" + e.detail.current + "]"]: true
        })
      }else{
        _this.setData({
          ["isSwiperText[" + key+ "]"]: false
        })
      }
    }
  },
  //管理中心-企业服务-自动值守

  get_info:function(){
    var _this = this;
    //请求企业信息
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res);
        res.data.result.service_suite = 0;
        if (res.data.sub_code == 0) {
          _this.setData({
            cd: res.data.result
          })
          /*
          var attend_status = res.data.result.attend_status;
          app.getServiceStatus(_this, 'ATTEND_FUNCTION', function(){
           //服务判断
            if (_this.data.serviceStatus=='closed'){
              _this.setData({
                'service[0].isShow': false
              })
            }else{
              //角色判断
              if (_this.data.role == 1) {
                _this.setData({
                  'service[0].isShow': false
                })
              } else {
                //是否开启判断
                if (attend_status == 1) {
                  _this.setData({
                    'service[0].text2': '已开启>'
                  })
                } else {
                  _this.setData({
                    'service[0].text2': '未开启>'
                  })
                }
              }
            }
          });
          */
        } else {
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  },

  //管理中心-企业服务-员工取卡-是否开启
  /*
  get_employeeCardAcquisition:function(){
    var _this = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code == 0) {
          _this.data.input_pic_url = res.data.result.input_pic_url;
          //请求
          app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
              service: 'company',
              method: 'get_company_service_status',
              data: JSON.stringify({
                union_id: wx.getStorageSync('xy_session'),
                service_key: 'EMPLOYEE_TAKE_CARD'
              })
            },
            success: res => {
              console.log(res);
              if (res.data.sub_code == 0) {
                if (res.data.result.service_status == 1 || res.data.result.service_status == 2) {
                  if (_this.data.input_pic_url !== '' && _this.data.cd.take_card_ways == 0) {
                    _this.setData({
                      'service[1].text2': '已开启>',
                      'service[1].url': '../employee/take-card/success/index?company_id=' + _this.data.cd.company_id
                    })
                  } else if (_this.data.input_pic_url !== '' && _this.data.cd.take_card_ways == 1) {
                    _this.setData({
                      'service[1].text2': '已开启>',
                      'service[1].url': '/pages/e-card/detail/index'
                    })
                  } else {
                    _this.setData({
                      'service[1].url': '../employee/take-card/open/index?company_id=' + _this.data.cd.company_id
                    })
                  }

                } else {
                  console.log('未开启');
                  _this.setData({
                    'service[1].url': '../employee/take-card/open/index?company_id=' + _this.data.cd.company_id
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
          console.log(res.data.sub_msg);
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  }
  */

})