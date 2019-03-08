var toast = require('../../../../templates/showToast/showToast');
const app = getApp();
Page({

  data: {
    isIphoneX: app.globalData.isIphoneX,
    empInfo: {
      "employee_id": 2,
      "union_id": "",
      "name": "李四",
      "phone": "120",
      "role": 0,
      "owner_id": 1,
      "asset_list": [
        {
          "id": 1,
          "owner_id": 100,
          "room_number": "3201",
          "area": 100,
          "floor_index": 32,
          "floor": "32",
          "building_name": "杭州望京大厦c1栋"
        }
      ],
      "privilege_list": [
        {
          "privilege_id": 1,
          "privilege_name": "添加人员"
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getEmployeeInfo(options.employee_id);
  },

  /**
   * 获取员工信息
   */
  getEmployeeInfo(employee_id) {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.networkUrl.postUrl({
      url: app.globalData.BASE_ASSET_URL + '/employee/get',
      params: {
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          employee_id: employee_id,
        })
      },
      success: res => {
        if (res.data.sub_code == 0) { }
          this.setData({
            //empInfo: res.data.result
          })

      }
    })
    
  },

  removeStaff: function() {
    toast.showToast(this, {
      toastStyle: 'toast4',
      title: '确认删除该员工？',
      introduce: '删除后，该员工将与您解除辅助关系，并且在员工列表中消失。',
      mask: true,
      isSure: true,
      sureText: '确认删除',
      isClose: true,
      closeText: '再考虑一下'
    });
  },

  /**
   * 取消拒绝并关闭弹层
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
        app.Util.networkUrl.postUrl({
          url: app.globalData.BASE_ASSET_URL + '/employee/delete',
          params: {
            data: JSON.stringify({
              union_id: wx.getStorageSync('xy_session'),
              employee_id: _this.data.empInfo.employee_id,
            })
          },
          success: res => {
            if (res.data.sub_code == 0) { }


          }
        })
      }
    });
  },

  reBind: function() {
    console.log("bind");
    wx.navigateTo({
      url: '../invite/index?employee_id=' + this.data.empInfo.employee_id,
    })
  }


})