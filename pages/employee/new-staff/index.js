var toast = require('../../../templates/showToast/showToast');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newStaff: null,
    apply: {
      status: null,
      apply_record_id: null
    }
  },

  /**
   * 获取新员工申请
   */
  getNewStaff: function () {
    var _this = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_apply_record_list',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        if (res.data.result) {
          _this.setData({
            newStaff: res.data.result
          }); 
        }
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.getNewStaff();
    
  },

  /**
   * 处理员工申请
   * refuse 拒绝
   * agree 同意
   */
  handleApply: function (e) {
    var mode = e.currentTarget.dataset.solve;
    var apply_record_id = e.currentTarget.dataset.recordid;
    if (mode == 'refuse') { 
      var status = 2
      this.setData({
        'apply.status': 2,
        'apply.apply_record_id': apply_record_id
      })
      toast.showToast(this, {
        toastStyle: 'toast6',
        title: '确定拒绝操作吗？',
        mask: true,
        isSure: true,
        sureText: '确定',
        isClose: true,
        closeText: '取消'
      });
    } else if (mode == 'agree') { 
      var status = 1
      this.applySubmit(apply_record_id, status);
    }
  },

  /**
   * 同意或者拒绝操作提交
   */
  applySubmit(apply_record_id, status) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'update_apply_record',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          apply_record_id: apply_record_id,
          status: status
        })
      },
      success: res => {
        if (res.data.sub_code == 0) {
          console.log(res.data);
          that.getNewStaff();
        }

      }
    })
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
        _this.applySubmit(_this.data.apply.apply_record_id, _this.data.apply.status);
      }
    });
  }

})