const md5 = require('../utils/md5.js');
const Promise = require('../utils/promise.js')
// 网络请求
// GET请求
function get(requestRouter) {
  checkRequestLogin('GET', requestRouter)
}
// POST请求
function post(requestRouter) {
  checkRequestLogin('POST', requestRouter)
}
//检测是否已登陆
function checkRequestLogin(method, requestRouter) {
  const app = getApp();
  app.checkWxLogin(function() {
    request(method, requestRouter, app)
  })
}

/**
 * 请求参数 requestRouter
 * requestRouter.url              'https://marvin-api-test.slightech.com/mini_program/api/'
 * requestRouter.params           { data: ({}) }
 * requestRouter.loadingTitle      '正在加载'
 * requestRouter.showLoading       true | false
 */
function request(method, requestRouter, app) {

  var dataJson = JSON.parse(requestRouter.params.data);
  dataJson.union_id = wx.getStorageSync('xy_session') //; //'o3iamjg7wPdNPO_uvqFM4cOr2p4w'

  requestRouter.params.data = JSON.stringify(dataJson);

  if (requestRouter.showLoading != false) {
    var title = requestRouter.loadingTitle != undefined ? requestRouter.loadingTitle : '正在加载';
    wx.showLoading({
      title: title,
      mask: true
    })
  }

  requestRouter.params.app_id = app.globalData.SIGN_DATA.app_id; //接口需要的第三方App_id
  requestRouter.params.timestamp = Math.round(new Date().getTime() / 1000 - 28800);
  requestRouter.params.sign_type = 'MD5';
  var stringA = 'app_id=' + requestRouter.params.app_id + '&data=' + requestRouter.params.data + '&timestamp=' + requestRouter.params.timestamp;
  requestRouter.params.sign = md5.hex_md5(stringA + '&key=' + app.globalData.SIGN_DATA.key);
  //打印参数
  console.log('requestRouter1111.params:', requestRouter.params);
  return new Promise((resolve, reject) => {
    wx.request({
      url: requestRouter.url,
      data: requestRouter.params,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        //未关注公众号跳转
        if (res.data.return_code == 'NO_FOLLOW') {
          var pages = getCurrentPages();
          var currentPage = pages[pages.length - 1] //获取当前页面的对象
          var url = currentPage.route; //获取当前页面url
          var opt = JSON.stringify(currentPage.options) //获取url中所带的参数
          wx.redirectTo({
            url: '/pages/checkfollow/index?route=' + url + '&opt=' + opt,
          })
        }

        if (res.data.sub_code != 0) {
          app.myLog("请求成功错误", 'union_id:' + wx.getStorageSync('xy_session') + '\nopen_id:' + wx.getStorageSync('open_id') + '\n\n请求参数：\n' + JSON.stringify(requestRouter.params) + '\n\n接口返回信息：\n' + JSON.stringify(res))
        }
        if (requestRouter.showLoading != false) {
          wx.hideLoading();
        }
        // if (requestRouter.success) requestRouter.success(res);
        resolve(res)
      },
      fail: (res) => {
        app.myLog("请求错误", 'union_id:' + wx.getStorageSync('xy_session') + '\nopen_id:' + wx.getStorageSync('open_id') + '\n\n请求参数：\n' + JSON.stringify(requestRouter.params) + '\n\n接口返回信息：\n' + JSON.stringify(res))
        if (requestRouter.showLoading != false) {
          wx.hideLoading();
        }

        wx.showToast({
          title: '加载失败，请尝试刷新',
          icon: 'none'
        })
        // if (requestRouter.fail) requestRouter.fail();
        reject(res)
      },
      complete: () => {
        wx.stopPullDownRefresh();
        if (requestRouter.complete) requestRouter.complete();
      }
    })
  })

}

module.exports.requestApi = {
  get: get,
  post: post
}
