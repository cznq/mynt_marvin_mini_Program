var menu = require('../../../templates/showMenu/showMenu');
var toast = require('../../../templates/showToast/showToast');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: null,
    noneStaff: false,
    noneData: {
      buttonText: '邀请员工',
      textInfo: '还没有任何员工，赶紧邀请加入员工'
    },
    editData: {
      union_id: null,
      employee_name: null
    },
    role: '',
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEmployeeInfo();
  },

  /**
   * 获取员工列表数据
   * first_name  员工列表的姓
   * last_name 员工列表的名字
   */
  getStaffList: function () {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_list',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res.data.result);
        if (res.data.result) {
          for (var i = 0; i < res.data.result.employee.length; i++) {
            res.data.result.employee[i].first_name = res.data.result.employee[i].employee_name.substring(0,1);
            res.data.result.employee[i].last_name = res.data.result.employee[i].employee_name.substring(1);
          }
          that.setData({
            staffList: res.data.result
          })
        }
        
      }
    })
  },

  getEmployeeInfo() {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            role: res.data.result.role
          })
        }
      },
      fail: res => {
        
      }
    })
  },

  /**
   * 删除员工
   * union_id 管理员的union_id
   * employee_union_id 员工的union_id
   */
  removeStaff(unionId) {
    var _this = this;
    console.log('remove');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'unbind_employee',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          employee_union_id: unionId
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {
          _this.getStaffList();
        } else {
          wx.showToast({
            title: '删除失败'
          })
        }
        
      }
    })
  },

  /**
   * 邀请员工 
   */
  inviteStaff: function () {
    wx.navigateTo({
      url: '/pages/employee/invite-staff/index',
    })
  },

  /**
   * 查看新员工
   */
  newStaff: function () {
    wx.navigateTo({
      url: '/pages/employee/new-staff/index',
    })
  },

  onPageScroll: function (e) {
    console.log(e.scrollTop);
    this.data.scrollTop = e.scrollTop;
  },
  /**
   * 员工列表点击编辑
   */
  editEmp: function (e) {
    console.log(e);
    console.log(e.target.offsetTop);
    console.log(e.detail.y);
    this.setData({ 
      'editData.union_id': e.currentTarget.dataset.unionid,
      'editData.employee_name': e.currentTarget.dataset.name
    });
    menu.showMenu(this, {
      menuList: ['从列表删除'],
      topPos: (e.currentTarget.offsetTop - this.data.scrollTop) + 32 + 'px',
      lrPos: 60 + 'rpx',
      isLeft: false,
      mask: true,
      bindFun: 'approveRemove'
    });
  },

  /**
   * 删除员工
   */
  approveRemove: function () {
    var self = this;
    menu.hideMenu();
    toast.showToast(this, {
      toastStyle: 'toast6',
      title: '确定要将“' + self.data.editData.employee_name + '“从团队删除吗？',
      introduce: '',
      mask: true,
      isSure: true,
      sureText: '确定',
      isClose: true,
      closeText: '取消'
    });
  },

  /**
   * 取消删除并关闭弹层
   */
  bindToastClose: function () {
    toast.hideToast();
  },

  /**
   * 确定删除
   */
  bindToastSure: function () {
    var _this = this;
    toast.hideToast(_this, {
      cb: function () {
        console.log('log');
        _this.removeStaff(_this.data.editData.union_id);
      }
    });
  },

  hideToastMenu: function () {
    menu.hideMenu();
  },

  preventTouchMove: function () {

  },

  onShow: function () {
    this.getStaffList();
  }

})