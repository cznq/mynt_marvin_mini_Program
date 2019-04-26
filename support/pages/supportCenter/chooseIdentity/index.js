// pages/supportCenter/chooseIdentity.js
const app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        slideData: {
            slideImg: {},
            indicatorDots: false,
            autoplay: true,
            interval: 5000,
            duration: 500
        },
        centerData: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _this = this;
        var slideImg = "slideData.slideImg";
        app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
                service: 'building',
                method: 'get_help_center_List',
                data: JSON.stringify({
                    union_id: wx.getStorageSync('xy_session')
                })
            },
            success: res => {
                console.log(res.data);
                if (res.data.sub_code == 0 && res.data.result) {
                    let ret = res.data.result;
                    _this.setData({
                        [slideImg]: ret.top_banners,
                        centerData: ret.help_list,
                    });
                } else {
                    toast.showToast(this, {
                        toastStyle: 'toast',
                        title: res.data.sub_msg,
                        duration: 1000,
                        mask: false,
                    });
                }
                console.log(_this.data);
            },
            fail: res => {
                console.log('fail');
            }
        })
    },
    redirectDetail: function(e) {
        var helpCenterId = e.currentTarget.dataset.centerid;
        wx.navigateTo({
            url: '/support/pages/supportCenter/introduce/index?centerid=' + helpCenterId,
        })
    },
    // 轮播图点击跳转
    linkRedirect: function(e) {
        var link = e.currentTarget.dataset.link;
        wx.navigateTo({
            url: link,
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