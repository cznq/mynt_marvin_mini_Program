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
        //res.data.result.introduction = '复古的风格发的';
        res.data.result.isRobotReview = false;
        _this.setData({
          cd: res.data.result
        });
        joinFloorRoom(_this.data.cd.floor, _this.data.cd.room, _this, _this.data.cd)
        //简介展开收起功能
        console.log();
        if (res.data.result.introduction.length != 0) {
          introductionSwitch(_this);
        }
        //机器人预览 管理员
        if (par == 'union_id') {
          setAdminRobotReview(app, _this);
        }
        //如果有成功的回调则
        cb && typeof cb == 'function' && cb();
      } else {
        console.log(res.data.sub_msg);
      }
      getServiceStatus(app, _this)
    },
    fail: res => {
      console.log('fail');
    }
  })
}
/**
 * 获取商业服务套件的状态
 */
function getServiceStatus(app, _this) {
  app.Util.network.POST({
    url: app.globalData.BASE_API_URL,
    params: {
      service: 'company',
      method: 'get_business_service_suite_status',
      data: JSON.stringify({}),
    },
    showLoading: false,
    success: res => {
      if (res.data.return_code === "SUCCESS") {
        _this.setData({
          'cd.service_suite': res.data.result.business_service_suite_status,
        })
      }
    }
  })
}

function joinFloorRoom(floor, room, _this, cd) {
  let arrayFloor = floor.split(',');
  let arrayRoom = room.split(',');
  let arrayLen = arrayFloor.length;
  let arrayFandR = [];
  let FloorAnRoom = '';
  for (let i = 0; i < arrayLen; i++) {
    let FloorAndRoom = arrayFloor[i] + ' ' + arrayRoom[i] + '室'
    arrayFandR.push(FloorAndRoom)
  }
  switch (arrayLen) {
    case 1:
      FloorAnRoom = `${arrayFandR[0]}`
      break;
    case 2:
      FloorAnRoom = `${arrayFandR[0]}，${arrayFandR[1]}`
      break;
    case 3:
      FloorAnRoom = `${arrayFandR[0]}，${arrayFandR[1]}，
           ${arrayFandR[2]}`
      break;
    case 4:
      FloorAnRoom = `${arrayFandR[0]}，${arrayFandR[1]}，
            ${arrayFandR[2]}， ${arrayFandR[3]}`
      break;
    case 5:
      FloorAnRoom = `${arrayFandR[0]}，${arrayFandR[1]}，
              ${arrayFandR[2]}，${arrayFandR[3]}，${arrayFandR[4]}`
      break;
    default:

  }
  _this.setData({
    ['cd.FloorAnRoom']: FloorAnRoom
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
function introductionSwitch(_this) {
  var query = wx.createSelectorQuery();
  query.select('#sonCon').boundingClientRect(function(qry) {
    var sonHeight = qry.height;
    if (sonHeight >= 88) {
      _this.setData({
        "cd.isEllipsis": true,
        "cd.isEllipsisbutton": true
      })
    }
  }).exec();
}
//简介展开
function introductionAll(_this) {
  console.log();
  if (_this.data.cd.isEllipsis == true) {
    _this.setData({
      "cd.isEllipsis": false
    })
  } else {
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