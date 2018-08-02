// pages/utils/util.js
var md5 = require('md5.js');

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
    requestHandler.params.app_id = '65effd5a42fd1870b2c7c5343640e9a8';
    requestHandler.params.timestamp = Math.round(new Date().getTime() / 1000 - 28800);
    requestHandler.params.sign_type = 'MD5';
    var stringA = 'app_id=' + requestHandler.params.app_id + '&data=' + requestHandler.params.data + '&method=' + requestHandler.params.method + '&service=' + requestHandler.params.service + '&timestamp=' + requestHandler.params.timestamp;
    requestHandler.params.sign = md5.hex_md5(stringA + '&key=a8bfb7a5f749211df4446833414f8f95');

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

  function checkID(ID) {
    if (typeof ID !== 'string') return '非法字符串';
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
    var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
    var d = new Date(birthday);
    var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
    var currentTime = new Date().getTime();
    var time = d.getTime();
    var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var sum = 0, i, residue;

    if (!/^\d{17}(\d|x)$/i.test(ID)) return false;
    if (city[ID.substr(0, 2)] === undefined) return false;
    if (time >= currentTime || birthday !== newBirthday) return false;
    for (i = 0; i < 17; i++) {
      sum += ID.substr(i, 1) * arrInt[i];
    }
    residue = arrCh[sum % 11];
    if (residue !== ID.substr(17, 1)) return false;

    return true;
  }

  function checkPassport(passport) {
    var reg = /^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/;
    if (reg.test(passport) === false) {
      return false;
    } else {
      return true;
    }
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
  module.exports.checkID = checkID;
  module.exports.checkPassport = checkPassport;
})();