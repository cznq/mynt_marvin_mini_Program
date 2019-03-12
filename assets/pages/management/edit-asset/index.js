// assets/pages/management/edit-asset/index.js
var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        building_address: "",
        building_name: "",
        id: "",
        area: "",
        room_number: "",
        floor_index: "",
        owner_id: "",
        employee_id: "",
        addType: "roomList",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _this = this;
        _this.setData({
            building_address: JSON.parse(options.building_address),
            building_name: JSON.parse(options.building_name),
            employee_id: JSON.parse(options.employee_id),
            id: JSON.parse(options.id), //资产id
            area: JSON.parse(options.area),
            room_number: JSON.parse(options.room), //房间号
            floor_index: JSON.parse(options.floor), //楼层索引
        })
        wx.setNavigationBarTitle({
            title: JSON.parse(options.room_number)
        });
    },

    jumpUrl: function() {
        var _this = this;
        var buildingAsset = JSON.stringify({
            buildingInfo: {
                id: _this.data.building_id,
                name: _this.data.building_name,
                address: _this.data.building_address,
            },
            owner_id: _this.data.owner_id,
            employee_id: _this.data.employee_id
        })
        wx.navigateTo({
            url: '../add-asset/index?buildingAsset=' + buildingAsset + '&from=' + _this.data.addType,
        })
    },

    removeAsset: function() {
        toast.showToast(this, {
            toastStyle: 'toast4',
            title: '确认删除该资产?',
            introduce: '删除后，该资产将与您解除绑定关系，并且在资产列表中消失。',
            mask: true,
            isSure: true,
            sureText: '确认删除',
            isClose: true,
            closeText: '再考虑一下'
        });
    },
    bindToastSure: function(value) {
        var _this = this;
        app.Util.networkUrl.postUrl({
            url: app.globalData.BASE_ASSET_URL + "/asset/delete",
            params: {
                data: JSON.stringify({
                    union_id: wx.getStorageSync('xy_session'),
                    owner_id: _this.data.owner_id,
                    id: _this.data.id
                })
            },
            success: res => {
                console.log('asset/delete return:');
                console.log(res);
                if (res.data.sub_code == "SUCCESS") {
                    wx.navigateBack({});
                } else {
                    _this.setData({
                        isfocus: false
                    })
                    toast.showToast(this, {
                        toastStyle: 'toast',
                        title: res.data.sub_msg,
                        duration: 2000,
                        mask: false,
                    });
                }
            },
            fail: res => {
                console.log('fail');
            }
        })
        toast.hideToast();
    },

    bindToastClose: function() {
        var _this = this;
        console.log("取消删除");
        toast.hideToast();
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