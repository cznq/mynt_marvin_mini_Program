import mockResponse from './mockResponse';
const md5 = require('../utils/md5.js');
// 网络请求
// GET请求
function get(requestRouter, resolve, reject) {
  checkRequestLogin('GET', requestRouter, resolve, reject)
}
// POST请求
function post(requestRouter, resolve, reject) {
    checkRequestLogin('POST', requestRouter, resolve, reject)
}
//检测是否已登陆
function checkRequestLogin(method, requestRouter, resolve, reject) {
  const app = getApp();
  app.checkWxLogin(function() {
    request(method, requestRouter, app, resolve, reject)
  })
}

/**
 * 请求参数 requestRouter
 * requestRouter.url              'https://marvin-api-test.slightech.com/mini_program/api/'
 * requestRouter.params           { data: ({}) }
 * requestRouter.loadingTitle      '正在加载'
 * requestRouter.showLoading       true | false
 */
function request(method, requestRouter, app, resolve, reject) {

  var dataJson = JSON.parse(requestRouter.params.data);
  dataJson.union_id = wx.getStorageSync('xy_session')

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
  console.log('requestRouter.params:', requestRouter.params);
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
      reject(res)
    },
    complete: () => {
      wx.stopPullDownRefresh();
      if (requestRouter.complete) requestRouter.complete();
    }
  })
}

// 老接口协议
// 网络请求

// GET请求
function GET(requestHandler) {
  CHECKRequest('GET', requestHandler)
}
// POST请求
function oldPost(requestHandler, resolve, reject) {
  CHECKRequest('POST', requestHandler, resolve, reject)
}
//检测是否已登陆
function CHECKRequest(method, requestHandler, resolve, reject) {
  var app = getApp();

  if (requestHandler.params.method == 'login') {
    request(method, requestHandler, app)
  } else {

    app.checkWxLogin(function() {
      oldRequest(method, requestHandler, app, resolve, reject)
    })

  }
}

/**
 * 请求参数 requestHandler
 * requestHandler.url              'https://marvin-api-test.slightech.com/mini_program/api/'
 * requestHandler.params           { service: 'oauth', method: 'login', data: ({}) }
 * requestHandler.loadingTitle      '正在加载'
 * requestHandler.showLoading       true | false
 */
function oldRequest(method, requestHandler, app, resolve, reject) {

  var dataJson = JSON.parse(requestHandler.params.data);
  dataJson.union_id = wx.getStorageSync('xy_session');
  if (requestHandler.params.method == 'pay') {
    dataJson.open_id = wx.getStorageSync('open_id');
  }
  requestHandler.params.data = JSON.stringify(dataJson);

  if (requestHandler.showLoading != false) {
    var title = requestHandler.loadingTitle != undefined ? requestHandler.loadingTitle : '正在加载';
    wx.showLoading({
      title: title,
      mask: true
    })
  }

  requestHandler.params.app_id = '65effd5a42fd1870b2c7c5343640e9a8'; //接口需要的第三方App_id
  requestHandler.params.timestamp = Math.round(new Date().getTime() / 1000 - 28800);
  requestHandler.params.sign_type = 'MD5';
  var stringA = 'app_id=' + requestHandler.params.app_id + '&data=' + requestHandler.params.data + '&method=' + requestHandler.params.method + '&service=' + requestHandler.params.service + '&timestamp=' + requestHandler.params.timestamp;
  requestHandler.params.sign = md5.hex_md5(stringA + '&key=a8bfb7a5f749211df4446833414f8f95');
  //打印参数

  wx.request({
    url: requestHandler.url,
    data: requestHandler.params,
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
        app.myLog("请求成功错误", 'union_id:' + wx.getStorageSync('xy_session') + '\nopen_id:' + wx.getStorageSync('open_id') + '\n\n请求参数：\n' + JSON.stringify(requestHandler.params) + '\n\n接口返回信息：\n' + JSON.stringify(res))
      }
      if (requestHandler.showLoading != false) {
        wx.hideLoading();
      }
      resolve(res)
    },
    fail: (res) => {
      app.myLog("请求错误", 'union_id:' + wx.getStorageSync('xy_session') + '\nopen_id:' + wx.getStorageSync('open_id') + '\n\n请求参数：\n' + JSON.stringify(requestHandler.params) + '\n\n接口返回信息：\n' + JSON.stringify(res))
      if (requestHandler.showLoading != false) {
        wx.hideLoading();
      }

      wx.showToast({
        title: '加载失败，请关闭后重试',
        icon: 'none'
      })
      reject(res)
    },
    complete: () => {
      wx.stopPullDownRefresh();
      if (requestHandler.complete) requestHandler.complete();
    }
  })
}

module.exports.requestApi = {
  get: get,
  post: post,
  oldPost: oldPost,
}
