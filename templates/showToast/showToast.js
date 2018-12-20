/*  
显示toast提示
toastStyle:   提示框式样名 默认toast
title:    提示的内容 必填
introduce:    介绍文案 选填
duration: 提示的延迟时间，单位毫秒，默认：1500, 10000永远存在除非手动清除 选填 
mask:     是否显示透明蒙层，防止触摸穿透，默认：true 选填
isSure:   是否显示确定按钮 默认 true 选填
sureText:   确定按钮文案 isSure->true 必填
isClose:   是否显示关闭按钮 默认 true 选填
closeText:    关闭按钮文案 isClose->true 必填
pic:     展示图 //请指定正确的路径，选填
isArrow: input错误提示小箭头
cb:       1500毫秒自动隐藏后接口调用成功的回调函数 选填 
 */
function showToast(_this, obj) {
  if (typeof obj == 'object') {
    if (!obj.isClose || typeof obj.isClose != 'boolean') {
      obj.isClose = false;
    }
    if (!obj.isSure || typeof obj.isSure != 'boolean') {
      obj.isSure = false;
    }
    if (obj.isSure == true && obj.sureText == '') {
      obj.sureText = '确定';
    }
    if (obj.isClose == true && obj.closeText == '') {
      obj.closeText = '取消';
    }
    if (!obj.isArrow || typeof obj.isArrow != 'boolean') {
      obj.isArrow = false;
    }

    //判断微信版本 小于1.9.9显示view标签模式
    var app = getApp();
    obj.version = app.globalData.version;

    obj.title = obj.title || "服务器繁忙，稍后再试";
    if (!obj.duration || typeof obj.duration != 'number') {
      obj.duration = 10000;
    }
    var that = _this; //获取当前page实例 
    obj.isShow = true; //开启toast  
    if (obj.duration < 10000) {
      setTimeout(function () {
        obj.isShow = false;
        obj.cb && typeof obj.cb == 'function' && obj.cb(); //如果有成功的回调则执行  
        that.setData({
          'showToast.isShow': obj.isShow
        });
      }, obj.duration);
    }
    that.setData({
      showToast: obj
    });
  } else {
    console.log('showToast fail:请确保传入的是对象并且title必填');
  }
}
/**  
 *手动关闭toast提示  
 */
function hideToast(_this, obj) {
  var that = getCurrentPages()[getCurrentPages().length - 1]; //获取当前page实例  
  if (typeof obj == "object") {
    obj.cb && typeof obj.cb == 'function' && obj.cb();
  }
  if (that.data.showToast) {
    that.setData({
      'showToast.isShow': false
    });
  }
}
module.exports = {
  showToast: showToast,
  hideToast: hideToast
}