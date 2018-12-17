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
        res.data.result.isRobotReview = false;
        if (res.data.result.introduction.length >= 68) {
          res.data.result.introductionAll = res.data.result.introduction;
          res.data.result.introduction = res.data.result.introduction.substr(0, 68) + '...';
          res.data.result.introductionAll_button = true;
        }
        if (par == 'union_id') {
          //机器人预览 管理员
          app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
              service: 'company',
              method: 'get_employee_info',
              data: JSON.stringify({
                union_id: wx.getStorageSync('xy_session'),
              })
            },
            success: res1 => {
              if (res1.data.sub_code == 0) {
                if (res1.data.result.role == 3) {
                  res.data.result.isRobotReview = true;
                  _this.setData({
                    cd: res.data.result
                  });
                }
              } else {
                console.log(res1.data.sub_msg);
              }
            },
            fail: res1 => {
              console.log('fail');
            }
          });

        } else {
          res.data.result.isRobotReview = false;
          _this.setData({
            cd: res.data.result
          });
        }
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
function introductionAll(_this) {
  _this.setData({
    'cd.introductionAll_button': false,
    'cd.introduction': _this.data.cd.introductionAll
  })
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