var toast = require('../../../templates/showToast/showToast');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newStaff: null
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
  onShow: function (options) {
   
    this.getNewStaff();
    
  },
  
  /**
   * 处理员工申请
   * refuse 拒绝
   * agree 同意
   */
  handleApply: function (e) {
    var apply_record_id = e.currentTarget.dataset.recordid;
    
    this.applySubmit(apply_record_id, 1);
   
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
        } else {
          toast.showToast(this, {
            toastStyle: 'toast',
            title: res.data.sub_msg,
            duration: 2000,
            mask: false,
            cb: function () { }
          });
        }

      }
    })
  }

})