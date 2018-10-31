// pages/company/unattended/unattended-index.js
var app = getApp();
var toast = require('../../templates/showToast/showToast');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '无人值守功能',
        introduce: '如果您不能及时处理前台到访请求,或者您希望访客能够直接来访,请打开这个开关',
        explain: '无人值守功能已经打开,访客将会直接来访',
        isShow: true,
        isChecked: true,
        union_id: "o3iamjv6fSidsfEAYTWpuBiYoZUE" //"wx.getStorageSync('xy_session')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    bindSwitchChange: function(e) {
        console.log('switch 发生 change 事件，携带值为', e.detail.value);
        if (e.detail.value) {
            toast.showToast(this, {
                toastStyle: 'toast4',
                title: '注意',
                introduce: '打开无人值守功能后,未申请到访的访客将会直接来到公司,请谨慎选择。',
                mask: true,
                isSure: true,
                sureText: '仍然打开',
                isClose: true,
                closeText: '取消'
            });
        } else {
            var that = this;
            that.setData({
                isShow: true
            })
        }

    },
    bindToastSure: function(value) {
        var that = this;
        that.setData({
            isShow: false
        });
        console.log("仍然打开");
        toast.hideToast();
    },
    bindToastClose: function() {
        var that = this;
        that.setData({
            isShow: true,
            isChecked: false
        })
        console.log("取消打开");
        toast.hideToast();
    }
})