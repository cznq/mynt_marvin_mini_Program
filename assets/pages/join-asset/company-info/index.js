// pages/join-asset/company-info/index.js
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isiphoneX: app.globalData.isIphoneX,
        companyTitle: "请填写企业信息",
        companyText: "公司全称",
        button_text: "下一步",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;
        _this.setData({
            companyName: options.name,
        });
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