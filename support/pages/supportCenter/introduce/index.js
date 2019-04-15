// pages/supportCenter/introduce/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        aaa: "http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/test1.png",
        currentIndex: 0,
        "imageList": ["a", "b", "c", "d"],
        "videoList": ["e", "f", "g", "h"],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let helpCenterId = options.centerId;
        console.log(helpCenterId);
    },
    pagechange: function(e) {
        if ("touch" === e.detail.source) {
            let currentPageIndex = this.data.currentIndex
            currentPageIndex = (currentPageIndex + 1) % 2
            this.setData({
                currentIndex: currentPageIndex
            })
        }
    },
    //点击tab切换
    tabClick: function(e) {
        this.setData({
            currentIndex: e.currentTarget.dataset.idx
        })
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