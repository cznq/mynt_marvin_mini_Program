function pubData(_this, app, service, method, union_id){
  app.Util.network.POST({
    url: app.globalData.BASE_API_URL,
    params: {
      service: service,
      method: method,
      data: JSON.stringify({
        union_id: union_id
      })
    },
    success: res => {
      console.log(res);
      if (res.data.sub_code == 0) {
        // res.data.result.address = '';
        //res.data.result.background_url = '';
        res.data.result.introduction = 'MYNTAI（小觅智能）2014年7月成立于美国硅谷，专注立体视觉技术整体解决方案，是行业领先的视觉定位导航VPS核心技MYNTAI（小觅智能）2014年7月成立于美国硅谷，专注立体视觉技术整体解决方案，是行业领先的视觉定位导航VPS核心技MYNTAI（小觅智能）2014年7月成立于美国硅谷，专注立体视觉技术整体解决方案，是行业领先的视觉定位导航VPS核心技';
        res.data.result.product_urls = ["http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/111.jpg"];
        // res.data.result.floor = '';
        res.data.result.logo = 'http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/111.jpg';
        
        // res.data.result.room = '';
        // res.data.result.phone = '';
        // res.data.result.website = '';

        //简介展开数据
        if (res.data.result.introduction.length >= 68) {
          res.data.result.introductionAll = res.data.result.introduction;
          res.data.result.introduction = res.data.result.introduction.substr(0, 68) + '...';
          res.data.result.introductionAll_button = true;
        }
        _this.setData({
          cd: res.data.result
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
    url: '../robotPreview/index'
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