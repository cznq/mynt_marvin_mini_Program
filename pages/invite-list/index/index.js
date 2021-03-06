var app = getApp()
var toast = require('../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    identity: 0, //0:非员工,1:普通职员,2:前台,3:公司管理员
    allTime: false,
    render: true,
    seleTime: '全部时间',
    time_range: 0, //0:全部,1:今天,2:本周,3:本月
    view_type: 0, //0:全部邀请，1:我的邀请
    page: 1, //下拉分页页码
    noneData: {
      buttonText: '邀请访客',
      emptyBtnFunc: 'emptyBtnFunc',
      textInfo: '暂无邀请',
      show: false
    },
    searchNoneData: {
      textInfo: '找不到匹配的内容',
      show: false
    },
    inviteList: [],
    inviteListCount: 0,
    searchStaffList: [],
    searchModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    if (options.view_type != void 0) {
      var returnTab = options.view_type
    }
    _this.get_employee_status(_this, returnTab)
  },
  emptyBtnFunc: function() {
    wx.navigateTo({
      url: '../../invite-visitor/start/index'
    })
  },
  //获取用户状态
  get_employee_status: function(_this, returnTab) {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({})
      },
      success: res => {
        // console.log('响应:', res);
        let data = res.data;
        if (data.sub_code === 0) {
          switch (data.result.role) { //0:角色待定,1:普通职员,2:前台,3:公司管理员
            case 0:
              wx.redirectTo({
                url: '/pages/manage/manage'
              })
              break;
            case 1:
              _this.setData({
                identity: 1,
                view_type: 1
              })
              break;
            case 2:
              _this.setData({
                identity: 2,
                view_type: 0
              })
              break;
            case 3:
              _this.setData({
                identity: 3,
                view_type: 0
              })
              break;
            default:
              break;
          }
        } else {
          wx.redirectTo({
            url: '/pages/manage/manage'
          })
        }
        if (returnTab != void 0) {
          _this.setData({
            view_type: returnTab
          })
        }
        //获取邀请列表
        let _data = _this.data;
        _this.get_visitor_list(_this, _data.view_type)

      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  //获取邀请列表
  get_visitor_list: function(_this, view_type = 0, time_range = 0, page = 1, visitor_name = '') {
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'visitor',
        method: 'get_invitation_list',
        data: JSON.stringify({
          "time_range": time_range,
          "visitor_name": visitor_name,
          "page": page,
          "page_size": 10,
          "view_type": view_type
        })
      },
      success: res => {
        // console.log('邀请列表响应:', res)
        let data = res.data
        if (!_this.data.searchModal) { //邀请列表
          if (data.return_code && data.result && data.return_code === 'SUCCESS') {
            let result = data.result
            if (page === 1) {
              _this.setData({
                inviteList: result.data,
                inviteListCount: result.count,
                ['noneData.show']: false
              })
            } else { //搜索列表
              let inviteList = _this.data.inviteList.concat(result.data);
              _this.setData({
                inviteList: inviteList,
                inviteListCount: result.count
              })
            }
          } else {
            _this.setData({
              inviteList: [],
              ['noneData.show']: true
            })
          }
        } else { //搜索列表
          if (data.return_code && data.result && data.return_code === 'SUCCESS') {
            let result = data.result
            _this.setData({
              searchStaffList: result.data,
              ['searchNoneData.show']: false
            })

          } else {
            _this.setData({
              searchStaffList: [],
              ['searchNoneData.show']: true
            })
          }
        }
        // _this.setData({
        //   render: true
        // })
      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  headTab: function(e) {
    this.setData({
      page: 1
    })
    let _this = this
    let _data = _this.data;
    let name = e.target.dataset.name;
    if (name === 'all_invit') {
      _this.setData({
        view_type: 0
      })
    }
    if (name === 'my_invit') {
      _this.setData({
        view_type: 1
      })
    }
    _this.get_visitor_list(_this, _data.view_type)
  },
  allTimeState: function() {
    let allTime = this.data.allTime;
    if (allTime) {
      this.setData({
        allTime: false
      })
    } else {
      this.setData({
        allTime: true
      })
    }
  },
  seleTime: function(e) {
    this.setData({
      page: 1
    })
    let _this = this
    let _data = _this.data;
    let seleTime = e.target.dataset.name;
    if (seleTime === '全部时间') {
      _this.setData({
        time_range: 0,
        seleTime: '全部时间'
      })
      _this.get_visitor_list(_this, _data.view_type, _data.time_range)
    }
    if (seleTime === '今天') {
      _this.setData({
        time_range: 1,
        seleTime: '今天'
      })
      _this.get_visitor_list(_this, _data.view_type, _data.time_range)
    }
    if (seleTime === '本周') {
      _this.setData({
        time_range: 2,
        seleTime: '本周'
      })
      _this.get_visitor_list(_this, _data.view_type, _data.time_range)
    }
    if (seleTime === '本月') {
      _this.setData({
        time_range: 3,
        seleTime: '本月'
      })
      _this.get_visitor_list(_this, _data.view_type, _data.time_range)
    }
    this.setData({
      seleTime: seleTime
    })
  },
  maskMove: function() {
    return false
  },
  currentEmployee: function(e) {
    let _this = this
    let invitationId = e.currentTarget.dataset.invitationid
    wx.navigateTo({
      url: '../invite-detail/invite-detail?' + 'invitation_id' + '=' + invitationId + '&' + 'view_type' + '=' + _this.data.view_type
    })
  },
  searchCurrenEmployee: function(e) {
    let invitationId = e.currentTarget.dataset.invitationid
    wx.navigateTo({
      url: '../invite-detail/invite-detail?' + 'invitation_id' + '=' + invitationId
    })
  },
  searchInput: function(e) {
    let _this = this
    let _data = _this.data;
    let searchValue = e.detail.value;
    if (searchValue) {
      _this.setData({
        clearSearchShow: true
      })
      _this.get_visitor_list(_this, _data.view_type, _data.time_range, 1, searchValue)
    } else {
      this.setData({
        clearSearchShow: true,
        searchStaffList: []
      })
    }

  },

  clearSearch: function() {
    this.setData({
      search: '',
      clearSearchShow: false,
      searchStaffList: [],
      ['searchNoneData.show']: false
    });
  },

  startSearchInput: function() {
    this.setData({
      searchModal: true
    })
  },

  searchCancel: function() {
    this.setData({
      searchModal: false,
      clearSearchShow: false,
      searchStaffList: [],
      ['searchNoneData.show']: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      searchModal: false,
      clearSearchShow: false,
      searchStaffList: [],
      ['searchNoneData.show']: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let _this = this
    let minVal = _this.data.inviteListCount - _this.data.inviteList.length
    if (minVal > 0) {
      let page = _this.data.page + 1
      _this.setData({
        page: page
      })
      _this.get_visitor_list(_this, _this.data.view_type, _this.data.time_range, _this.data.page)
    } else {
      toast.showToast(_this, {
        toastStyle: 'toast',
        title: '全部加载完毕',
        duration: 1000,
        mask: false
      });
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})