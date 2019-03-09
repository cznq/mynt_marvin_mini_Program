// pages/join-asset/person-info/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        personTitle: "请填写个人信息",
        button_text: "下一步",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // var options = new Array();
        // options.name = "张三";
        // options.phone = "13120286041";
        // options.number = "230606111122222222";
        let _this = this;
        _this.setData({
            owner_id: options.owner_id,
            name: options.name,
            phone: options.phone,
            number: options.number
        });
    },
    nextStep: function(e) {
        let name = e.detail.value.name;
        let number = e.detail.value.number;
        let phone = e.detail.value.phone;
        let _this = this;
        let url = '../upload-id/index?owner_id=' + _this.owner_id + '&number=' + number + '&phone=' + phone + '&name=' + name + '&phone=' + phone;
        wx.navigateTo({
            url: url
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