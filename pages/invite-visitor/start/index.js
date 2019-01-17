var toast = require('../../../templates/showToast/showToast');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   * serviceStatus   tried 试用；closed 关闭；opened 开通；
   * limitCount     -1不做限制，0为次数用完
   */

  data: {
    serviceStatus: '',
    limitCount: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getServiceStatus(that, 'INVITE_VISITOR');
    
  },

  goToInvite: function () {
    if (this.data.limitCount == 0) {
      toast.showToast(this, {
        toastStyle: 'toast2',
        title: '您的邀请次数已用完',
        introduce: ' ',
        mask: true,
        isSure: true,
        sureText: '好的'
      });
    } else {
      wx.navigateTo({
        url: '/pages/invite-visitor/edit/index',
      })
    }
    
  },

  //确定关闭弹层
  bindToastSure: function () {
    toast.hideToast(this, {
      
    });
  },

  /**
   * 了解小觅商业服务套件
   */
  viewBusinessService() {
    app.viewBusinessService();
  }

})