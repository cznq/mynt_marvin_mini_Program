const Promise = require('utils/promise.js');
/**
 * Fundebug 打印日志
 * 其它页面引用  app.globalData.fundebug.notify("TEST", "Hello, Fundebug!");
 * 抛出的错误对象   app.globalData.fundebug.notifyError(new Error("TEST"));
 * 
 */
var fundebug = require('utils/fundebug.0.9.0.min.js');
// 配置项
fundebug.init({
  //apikey: "950ab8d47c6dbb69527a604ee684c588369af4dd554cc59fa38e1e4aa5b763ac",  //正式环境
  apikey: "f7a08bd4f8006965ba11314b2571777ea295a98e84766ade31bdb5c272b87428",  //测试环境
  silent: false
})

App({
  globalData: {
    fundebug: fundebug,
    open_id_type: 1,
    isIphoneX: false,
    BASE_IMG_URl: 'https://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/',
    //BASE_API_URL: 'http://61.149.7.239:10001/mini_program/api/',
    //WEB_VIEW_URL: 'https://marvin-official-account-dev.slightech.com',
    //BENIFIT_API_URL: 'http://61.149.7.239:10004/mini_program/api',
    BASE_API_URL: 'https://marvin-api-test.slightech.com/mini_program/api/',
    BENIFIT_API_URL: 'https://marvin-benifit-api-test.slightech.com/mini_program/api',
    WEB_VIEW_URL: 'https://marvin-official-account-test.slightech.com',
    //BASE_API_URL: 'http://192.168.1.204:10001/mini_program/api/',//开发环境
    //BENIFIT_API_URL: 'http://192.168.1.204:10004/mini_program/api',//员工福利开发环境

  },
  
  onLaunch: function () {
    /**  获取手机信息 */
    var that = this;
    wx.getSystemInfo({
      success(res) {
        wx.setStorage({
          key: 'sysinfo', 
          data: res,
        })
        if (res.model.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
        var version = res.SDKVersion;
        if (that.Util.compareVersion(version, '2.2.5') >= 0) {
          that.globalData.version = false
        }else{
          that.globalData.version = true
        }
      }
    })
    
  },    

  onShow: function () {
    if (wx.getUpdateManager) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log('小程序版本更新提示：' + res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '更新提示',
          content: '新版本下载失败',
          showCancel: false
        })
      })
    }
    
    
  },     

  /**
   * 自定义日志函数
   */       
  myLog(tit, cont) {
    var sysinfo = wx.getStorageSync('sysinfo');
    fundebug.notify(tit, cont + '\n\n基础信息：\n' + JSON.stringify(sysinfo));
  },
  
  Util: require('utils/util.js'),

  /**
   * 检查App是否登录
   */
  checkSession: function () {
    if (wx.getStorageSync('xy_session') == '' || wx.getStorageSync('xy_session') == null || wx.getStorageSync('open_id') == '' || wx.getStorageSync('open_id') == null) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * 检测微信登录
   */
  checkWxLogin(callback) {
    var that = this;
    if (that.checkSession()) {
      //console.log("---通过登录检测---");
      callback();
    } else {
      wx.login({
        success: res => {
          if (res.code) {
            that.thirdLogin(res.code, null, null, callback);
          } else {
            that.myLog("微信登录失败", res.errMsg)
          }
        }
      })
    }
    
  },

  /**
   * 第三方服务器登录
   * Param: code 必填, encryptedData 选填, iv 选填
   */
  thirdLogin(code, encryptedData, iv, callback) {
    var that = this;
    that.Util.network.POST({
      url: that.globalData.BASE_API_URL,
      params: {
        service: 'oauth',
        method: 'login',
        data: JSON.stringify({
          code: code,
          encrypted_data: encryptedData,
          iv: iv
        })
      },
      success: res => {
        console.log('res');
        if (res.data.sub_code == 0) {
          wx.setStorageSync('xy_session', res.data.result.union_id);
          wx.setStorageSync('open_id', res.data.result.open_id);
          wx.setStorageSync('nickname', res.data.result.nickname);
          wx.setStorageSync('avatar', res.data.result.avatar);
          callback();
        } else {
          that.myLog("进入授权登录页面", "跳转到登录页面");
          var pages = getCurrentPages();
          var currentPage = pages[pages.length - 1]
          var url = currentPage.route;
          var opt = JSON.stringify(currentPage.options)
          wx.redirectTo({
            url: '/pages/login/index?route=' + url + '&opt=' + opt,
          })
        }
        
      },
      fail: res => {
        callback();
        console.log('fail');
      }
    })
  },


  /**
   * 授权登录，弹出授权框
   */
  authorizeLogin(encryptedData, iv, callback = function () { }) {
    var that = this;
    wx.login({
      success: res => {
        if (res.code) {
          that.thirdLogin(res.code, encryptedData, iv, callback);
        }
      },
      fail: res => {
        console.log('获取用户登录态失败！' + res.errMsg);
      }
    })

  },

  /**
   * 查看服务状态开启
   * serviceStatus   状态，0：关闭，1：开通，2：试用
   * param: service 
   * EMPLOYEE_TAKE_CARD     员工取卡
   * SHOW_AD_AFTER_TAKE_CARD     取卡后播放广告
   * ATTEND_FUNCTION     无人值守
   * INVITE_VISITOR     邀请访客
   * EMPLOYEE_BENIFIT     周边福利
   * COMPANY_INTRODUCE_MEDIA     公司图文视频介绍
   */
  getServiceStatus(_this, service, callback = function () { }) {
    var that = this;
    that.Util.network.POST({
      url: that.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_company_service_status',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          service_key: service
        })
      },
      success: res => {
        if (res.data.result) {
          if (res.data.result.service_status == 0) {
            _this.setData({
              serviceStatus: 'closed',
              limitCount: res.data.result.limit_count
            })
          }
          if (res.data.result.service_status == 1) {
            _this.setData({
              serviceStatus: 'opened',
              limitCount: res.data.result.limit_count
            })
          }
          if (res.data.result.service_status == 2) {
            _this.setData({
              serviceStatus: 'tried',
              limitCount: res.data.result.limit_count
            })
          }
          callback();
        }
      },
      fail: res => {
        console.log('获取服务失败')
      }
    })
  },

  /**
  * 了解小觅商业服务套件
  */
  viewBusinessService() {
    wx.navigateTo({
      url: '/benifit/pages/suite-introduce/suite-introduce',
    })
  },

  /**
   * 查看公司介绍页
   */
  viewCompanyInfo() {
    wx.navigateTo({
      url: '/pages/company/introduction/index',
    })
  },

  /**
   * 身份信息提交
   * param: id_type, phone, id_number
   */
  idInformationSubmit(service, method, id_type, phone, id_number, callback = function () {}) {
    var that = this;
    that.Util.network.POST({
      url: that.globalData.BASE_API_URL,
      params: {
        service: service,
        method: method,
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          id_type: id_type,
          phone: phone,
          id_number: id_number
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {
          callback();
        } else {
          wx.showToast({
            icon: 'none',
            title: '提交身份信息失败'
          })
        }
      }
    })

  },

  /**
   * 申请信息提交
   * param: company_id, form_id, visitor_name, note, id_type, phone, id_number
   */
  applySubmit(company_id, form_id, visitor_name, note, callback = function () { }) {
    var that = this;
    that.Util.network.POST({
      url: that.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'visit_apply',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          form_id: form_id,
          visit_company_id: company_id,
          visitor_name: visitor_name,
          note: note
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {
          //console.log(res.data.result.visit_apply_id);
          callback(res.data.result.visit_apply_id);
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.sub_msg
          })
        }
      }
    })
    
  },

  /**
   * 接受邀请
   * Param: invitation_id
   */
  receiveSubmit(invitation_id, formId, callback = function () {}) {
    var that = this;
    that.Util.network.POST({
      url: that.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'accept_invitation',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          invitation_id: invitation_id,
          form_id: formId
        })
      },
      success: res => {
        if (res.data.sub_code==0) {
          callback();
        } else {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none'
          })
        }
        
      },
      fail: res => {

      }
    })
  },

  /**
   * 检测是否录入身份和人脸信息
   * param:  personType (employee 员工, visitor 访客)
   */
  checkHasRecodeFace(personType, visit_company_id, callback) {
    var that = this;
    if (personType == 'employee') {
      var service = 'company', method = 'get_employee_info';
    } else if (personType == 'visitor') {
      var service = 'visitor', method = 'get_visitor_info';
    } else {
      return false;
    }
    that.Util.network.POST({
      url: that.globalData.BASE_API_URL,
      params: {
        service: service,
        method: method,
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          visit_company_id: visit_company_id
        })
      },
      success: res => {
        console.log(res);
        if (res.data.result) {
          callback(res.data.result.input_pic_url);
        } else if (res.data.sub_msg =='访客不存在') {
          callback('');
        }
        
      },
      fail: res => {
   
      }
    })
  }


})