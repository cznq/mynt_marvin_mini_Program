/* 
* mask:     是否显示透明蒙层，防止触摸穿透，默认：true 选填
* topPos: 距离屏幕上方的距离
* rlPos: 距离右边或者左边的距离
* isLeft: true为距离左边的距离，false为距离右边的距离,默认距离右边
* menuList  菜单列表
 */
function showMenu(_this, obj) {
  if (typeof obj == 'object') {
    if (!obj.topPos || typeof obj.topPos == '') {
      obj.topPos = '50%';
    }
    if (!obj.rlPos || typeof obj.rlPos == '') {
      obj.rlPos = '50%';
    }
    if (!obj.isLeft || typeof obj.isLeft !== 'boolean') {
      obj.isLeft = false;
    }
    obj.menuList = obj.menuList || ['error'];
    var that = _this; //获取当前page实例 
    obj.isShow = true; //显示menu  
    that.setData({
      showMenu: obj
    });
  } else {
    console.log('请传入菜单列表');
  }
}

/**  
 * 手动关闭menu提示  
 */
function hideMenu(obj) {
  var that = getCurrentPages()[getCurrentPages().length - 1]; //获取当前page实例  
  if (that.data.showMenu) {
    that.setData({
      'showMenu.isShow': false
    });
  }
}

module.exports = {
  showMenu: showMenu,
  hideMenu: hideMenu
}