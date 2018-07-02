// pages/utils/util.js


; (function () {

  // 网络请求

  // GET请求
  function GET(requestHandler) {
    request('GET', requestHandler)
  }
  // POST请求
  function POST(requestHandler) {
    request('POST', requestHandler)
  }

  function request(method, requestHandler) {

    var app = getApp();

    wx.showLoading({
      title: '正在加载',
      mask: true
    })

    //if (app.globalData.w2w_session != null && app.globalData.w2w_session != '') {
    //	requestHandler.params = Object.assign({}, requestHandler.params, { w2w_session: app.globalData.w2w_session });
    //}

    wx.request({
      url: requestHandler.url,
      data: requestHandler.params,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        wx.hideLoading();
        if (requestHandler.success) requestHandler.success(res);
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '加载失败，请尝试刷新',
          icon: 'none'
        })
        if (requestHandler.fail) requestHandler.fail();
      },
      complete: () => {
        wx.stopPullDownRefresh();
        if (requestHandler.complete) requestHandler.complete();
      }
    })
  }

  // 日期格式转换
  function dateFormat(fmt) {
    var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  // 数组去重
  function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
      if (!hash[elem]) {
        result.push(elem);
        hash[elem] = true;
      }
    }
    return result;
  }

  // 复制到剪贴板
  function setClipboard(text) {
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制',
        })
      }
    })
  }

  function getDate() {
    var myDate = new Date();
    var year = myDate.getFullYear();    
    var month = myDate.getMonth() + 1;
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    var day = myDate.getDate();
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    var newDay = year + "-" + month + "-" + day;
    return newDay;
  }

  function getTime() {
    var myDate = new Date();
    var hour = myDate.getHours();
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    var minute = myDate.getMinutes();
    if (minute >= 0 && minute <= 9) {
      minute = "0" + minute;
    }
    return hour + ":" + minute;
  }

  function formatTime(fmt) {
    var date = new Date();
    date.setTime((fmt - 8 * 3600) * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
  } 

  module.exports.network = {
    GET: GET,
    POST: POST
  }

  module.exports.dateFormat = dateFormat;
  module.exports.unique = unique;
  module.exports.setClipboard = setClipboard;
  module.exports.getDate = getDate;
  module.exports.getTime = getTime;
  module.exports.formatTime = formatTime;
})();