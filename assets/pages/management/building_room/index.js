// assets/pages/management/building_room/index.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        building_id: '',
        owner_id: '',
        employee_id: '',
        building_name: '',
        building_address: '',
        cd: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            building_id: JSON.parse(options.buildingInfo).building_id,
            owner_id: JSON.parse(options.buildingInfo).owner_id,
            employee_id: JSON.parse(options.buildingInfo).employee_id,
            building_name: JSON.parse(options.buildingInfo).building_name,
            building_address: JSON.parse(options.buildingInfo).building_address
        })
        wx.setNavigationBarTitle({
            title: that.data.building_name
        })
        app.Util.networkUrl.postUrl({
            url: app.globalData.BASE_ASSET_URL + '/asset/building/list',
            params: {
                data: JSON.stringify({
                    owner_id: that.data.owner_id,
                    building_id: that.data.building_id,
                    employee_id: that.data.employee_id
                })
            },
            success: res => {
                if (res.data.result) {
                    that.setData({
                        cd: res.data.result.asset_list
                    })
                }
            }
        })
    },
    addRoom: function(e) {
        var buildingAsset = JSON.stringify({
            buildingInfo: {
                id: this.data.building_id,
                name: this.data.building_name,
                address: this.data.building_address,
            },
            owner_id: this.data.owner_id,
            employee_id: this.data.employee_id
        })
        wx.navigateTo({
            url: '../add-asset/index?buildingAsset=' + buildingAsset + '&from=' + e.currentTarget.dataset.from,
        })
    },
    assetDetail: function(e) {
        var params = JSON.stringify({
            building_address: this.data.building_address,
            owner_id: this.data.owner_id,
            employee_id: this.data.employee_id,
            building_name: this.data.building_name,
            id: e.currentTarget.dataset.id, //资产id
            area: e.currentTarget.dataset.area,
            room_number: e.currentTarget.dataset.room, //房间号
            floor: e.currentTarget.dataset.floor, //楼层名
        })
        wx.navigateTo({
            url: '../edit-asset/index?params=' + params,
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