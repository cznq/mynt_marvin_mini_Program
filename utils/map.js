var QQMapWX = require('qqmap-wx-jssdk.min.js');
var mapKey = 'CGVBZ-S2KHV-3CBPC-UP4JI-4N55F-7VBFU';
var mapMethod = {
  //获取地图经纬度
  generateMap(address) {
    var qqmapsdk = new QQMapWX({
      key: mapKey
    });
    qqmapsdk.geocoder({
      address: address,
      success: function (res) {
        this.setData({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng
        })
      },
      fail: function (res) {
        return false;
      },
      complete: function (res) {
        console.log(res);
      }
    })
  }
  
}

module.exports = mapMethod;