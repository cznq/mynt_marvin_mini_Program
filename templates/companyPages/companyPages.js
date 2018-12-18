function pubData(_this, app, service, method, parameter, cb) {

  if (method == "get_info") {
    var par = 'union_id'
  } else if (method == "get_company_info") {
    var par = 'company_code'
  }
  app.Util.network.POST({
    url: app.globalData.BASE_API_URL,
    params: {
      service: service,
      method: method,
      data: JSON.stringify({
        [par]: parameter
      })
    },
    success: res => {
      console.log(res);
      if (res.data.sub_code == 0) {
        //简介展开数据
        // res.data.result.isRobotReview = false;
        // if (res.data.result.introduction.length >= 68) {
        //   res.data.result.introductionAll = res.data.result.introduction;
        //   res.data.result.introduction = res.data.result.introduction.substr(0, 68) + '...';
        //   res.data.result.introductionAll_button = true;
        // }
        
        res.data.result.isRobotReview = false;
        _this.setData({
          cd: res.data.result
        });
        //简介展开收起功能
        introductionSwitch(_this);
        //机器人预览 管理员
        if (par == 'union_id') {   
          setAdminRobotReview(app, _this);
        }
        //如果有成功的回调则
        cb && typeof cb == 'function' && cb(); 
      } else {
        console.log(res.data.sub_msg);
      }
    },
    fail: res => {
      console.log('fail');
    }
  })
}
// 如果有union_id则判断是否是管理员来判断是否显示机器人预览
function setAdminRobotReview(app, _this) {
  app.Util.network.POST({
    url: app.globalData.BASE_API_URL,
    params: {
      service: 'company',
      method: 'get_employee_info',
      data: JSON.stringify({
        union_id: wx.getStorageSync('xy_session'),
      })
    },
    success: res => {
      if (res.data.sub_code == 0) {
        if (res.data.result.role == 3) {
          _this.setData({
            "cd.isRobotReview": true
          });
        }
      } else {
        console.log(res.data.sub_msg);
      }
    },
    fail: res => {
      console.log('fail');
    }
  });
}
//简介展开收起功能
function introductionSwitch(_this){
  var query = wx.createSelectorQuery();
  query.select('#sonCon').boundingClientRect(function (qry) {
    var sonHeight = qry.height;
    if (sonHeight >= 88) {
      _this.setData({
        "cd.isEllipsis": true
      })
    }
  }).exec();
}
//简介展开
function introductionAll(_this) {
  console.log();
  if (_this.data.cd.isEllipsis==true){
    _this.setData({
      "cd.isEllipsis": false
    })
  }else{
    _this.setData({
      "cd.isEllipsis": true
    })
  }
  // _this.setData({
  //   'cd.introductionAll_button': false,
  //   'cd.introduction': _this.data.cd.introductionAll
  // })
}
//机器人端预览
function robotPreview() {
  wx.navigateTo({
    url: '/pages/create-company/robotPreview/index'
  })
}
//分享
function shareMessage(_this) {
  var title = _this.data.cd.company_short_name + '的公司主页';
  var path = '/pages/company/otherCompany/index?company_code=' + _this.data.cd.company_code;
  var imageUrl = '';
  return [title, path, imageUrl];
}
module.exports = {
  cd: pubData,
  introductionAll: introductionAll,
  robotPreview: robotPreview,
  shareMessage: shareMessage
}