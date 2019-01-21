// pages/company-unattended/index.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     * serviceStatus   tried 试用；closed 关闭；opened 开通；
     */
    data: {
        serviceStatus: '', 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that= this;
        app.getServiceStatus(that, 'ATTEND_FUNCTION');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    goSetting:function () {
        wx.navigateTo({
            url: '/pages/company/unattended-setting/setting/index',
        })
    },
    /**
     * 了解小觅商业服务套件
     */
    viewBusinessService() {
        app.viewBusinessService();
    }
})