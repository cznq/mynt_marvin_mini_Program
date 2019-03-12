// pages/join-asset/homepage/index.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        headlinesT1: "欢迎使用",
        headlinesT2: "小觅资产管理系统",
        explainText: "资产管理便捷高效，多套房源一手掌握， 线上收租方便快捷。",
        buttonText: "立即体验"
    },

    jumpUrl: function() {
        var _this = this;
        app.Util.networkUrl.postUrl({
            url: app.globalData.BASE_ASSET_URL + "/employee/get/union_id",
            params: {
                data: JSON.stringify({
                    union_id: wx.getStorageSync('xy_session'),
                })
            },
            success: res => {
                console.log('owner-get-verifycode return:');
                console.log(res);
                if (res.data.sub_code == "SUCCESS") {
                    wx.setStorageSync('asset_info', {
                        "employee_id": rinfo.employee_id,
                        "owner_id": rinfo.owner_id,
                        "assetName": rinfo.name
                    });
                    let rinfo = res.data.result;
                    var params = JSON.stringify({
                        employee_id: rinfo.employee_id,
                        // building_address: rinfo.building_address,
                        union_id: rinfo.union_id,
                        owner_id: rinfo.owner_id,
                        phone: rinfo.phone,
                        role: rinfo.role,
                        assetName: rinfo.name,
                        asset_list: rinfo.asset_list,
                        privilege_list: rinfo.privilege_list
                    })
                    wx.navigateTo({
                        url: '../../management/assets-list/index?params=' + params,
                    })
                } else {
                    wx.navigateTo({
                        url: "../invite-code/index",
                    });
                }
            },
            fail: res => {
                console.log('fail');
            }
        })
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

    }
})