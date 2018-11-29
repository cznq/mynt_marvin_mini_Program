function pubData(_this, app, service, method,parameter,cb){

  if (method =="get_info"){
    var par = 'union_id'
  } else if(method == "get_company_info"){
    var par = 'company_code'
  }

  app.Util.network.POST({
    url: app.globalData.BASE_API_URL,
    params: {
      service: service,
      method: method,
      data: JSON.stringify({
        [par]:parameter
      })
    },
    success: res => {
      console.log(res);
      if (res.data.sub_code == 0) {
        //简介展开数据
        if (res.data.result.introduction.length >= 68) {
          res.data.result.introductionAll = res.data.result.introduction;
          res.data.result.introduction = res.data.result.introduction.substr(0, 68) + '...';
          res.data.result.introductionAll_button = true;
        }
        _this.setData({
          cd: res.data.result
        })

        cb && typeof cb == 'function' && cb(); //如果有成功的回调则执行  
        
      } else {
        console.log(res.data.sub_msg);
      }
    },
    fail: res => {
      console.log('fail');
    }
  })
}
//简介展开
function introductionAll(_this){
  _this.setData({
    'cd.introductionAll_button': false,
    'cd.introduction': _this.data.cd.introductionAll
  })
}
//机器人端预览
function robotPreview(){
  wx.navigateTo({
    url: '/pages/create-company/robotPreview/index'
  })
}
//分享
function shareMessage(_this){
  var title = _this.data.cd.company_short_name + '的公司主页';
  var path = '';
  var imageUrl = '';
  return [title,path, imageUrl];
}

module.exports = {
  cd: pubData,
  introductionAll: introductionAll,
  robotPreview: robotPreview,
  shareMessage: shareMessage
}