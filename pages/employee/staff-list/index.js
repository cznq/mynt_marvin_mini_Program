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
      employee_name: null,
      role: null
    },
    role: '',
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      fail: res => {}
    })

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

  onPageScroll: function (e) {
    console.log(e);
    this.data.scrollTop = e.scrollTop;
  },
  /**
   * 员工列表点击编辑
   */
  editEmp: function (e) {
    console.log(e.currentTarget);
    this.setData({ 
      'editData.union_id': e.currentTarget.dataset.unionid,
      'editData.employee_name': e.currentTarget.dataset.name,
      'editData.role': e.currentTarget.dataset.role
    });
    if (e.currentTarget.dataset.role ==2) {
      var menuList = ['从列表删除', '取消前台'], bindFun = ['approveRemove', 'setFront']
    } else {
      var menuList = ['从列表删除', '设为前台'], bindFun = ['approveRemove', 'setFront']
    }
    var btDis = wx.getStorageSync('sysinfo').windowHeight;
    console.log(btDis);
    if (btDis - e.currentTarget.offsetTop < 80) {
      var topPos = (e.currentTarget.offsetTop - this.data.scrollTop) - 82 + 'px';
    } else {
      var topPos = (e.currentTarget.offsetTop - this.data.scrollTop) + 32 + 'px';
    }
    
    menu.showMenu(this, {
      menuList: menuList,
      topPos: topPos,
      lrPos: 60 + 'rpx',
      isLeft: false,
      mask: true,
      bindFun: bindFun
    });
  },

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
   * 设置前台
   */
  setFront: function () {
    var that = this;
    var role = this.data.editData.role==2?1:2
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'update_employee_role',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          employee_union_id: that.data.editData.union_id,
          role: role
        })
      },
      success: res => {
        menu.hideMenu();
        if (res.data.sub_code == 0) {
          that.getStaffList();
        } else {
          wx.showToast({
            title: '设置前台失败'
          })
        }

      }
    })
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
        app.Util.network.POST({
          url: app.globalData.BASE_API_URL,
          params: {
            service: 'company',
            method: 'unbind_employee',
            data: JSON.stringify({
              union_id: wx.getStorageSync('xy_session'),
              employee_union_id: _this.data.editData.union_id
            })
          },
          success: res => {
            if (res.data.sub_code == 0) {
              _this.getStaffList();
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }

          }
        })
        
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