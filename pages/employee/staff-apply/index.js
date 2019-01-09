// pages/employee/staff-apply/index.js
var toast = require('../../../templates/showToast/showToast');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyInfo: null,
    apply_record_id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.apply_record_id = options.apply_id
    this.getApplyInfo(options.apply_id);

  },

  getApplyInfo(apply_record_id) {
    var that = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_apply_join_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          apply_id: apply_record_id
        })
      },
      success: res => {
        if (res.data.result) {
          that.setData({
            applyInfo: res.data.result
          });
        }

      }
    })
  },
 
  applyRefuse() {
    toast.showToast(this, {
      toastStyle: 'toast6',
      title: '确定拒绝操作吗？',
      mask: true,
      isSure: true,
      sureText: '确定',
      isClose: true,
      closeText: '取消'
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
        _this.applySubmit(_this.data.apply_record_id, 2);
      }
    });
  },

  applyAgree() {
    this.applySubmit(this.data.apply_record_id, 1);
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
          that.getApplyInfo(that.data.apply_record_id);
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }


})