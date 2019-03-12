// assets/pages/management/edit-asset/index.js
var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        room: "望京大厦E栋 16层1603",
        area: "建筑面积：359㎡",
        address: "杭州市萧山区景贤路21号"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: "16330"
        });
        // this.setData({
        //     owner_id: JSON.parse(options.params).owner_id,
        //     employee_id: JSON.parse(options.params).employee_id,
        //     nextStep: true
        // })
    },

    removeAsset: function() {
        var _this = this;

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

    }
})