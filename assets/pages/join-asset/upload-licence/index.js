// pages/join-asset/upload-licence/index.js
var app = getApp();
var toast = require("../../../../templates/showToast/showToast");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mainTitle: '请上传营业执照',
        explain: "上传营业执照照片，这将帮助我们审核您的公司，维护平台的安全。您的证件信息会严格为您保密。",
        mainText: '上传营业执照照片',
        subText: '请按照图例上传相关证件',
        button_text: '完成',
        disabled: true,
        selMode: 'license',
        submit: false
    },
    currentState(e) {
        console.log(e.detail);
        if (e.detail.uploadState) {
            this.setData({
                disabled: false,
                sucUplodImg: e.detail.sucUplodImg
            })
        }
        var _this = this;
        console.log(_this.data);
    },
    completeUpload() {
        var _this = this;
        console.log(_this.data);
        app.Util.networkUrl.postUrl({
            url: app.globalData.BASE_ASSET_URL + "/owner/update",
            params: {
                data: JSON.stringify({
                    union_id: wx.getStorageSync('xy_session'),
                    owner_id: _this.data.owner_id,
                    name: _this.data.name,
                    number: _this.number,
                    phone: _this.phone,
                    paperwork_pic_url: _this.sucUplodImg
                })
            },
            success: res => {
                console.log('owner/update:');
                console.log(res);
                if (res.data.sub_code == "SUCCESS") {
                    var info = "上传成功";
                } else {
                    var info = res.data.sub_msg
                }
                toast.showToast(this, {
                    toastStyle: 'toast',
                    title: info,
                    duration: 2000,
                    mask: false,
                    cb: function() {
                        _this.setData({
                            isfocus: true
                        })
                    }
                });

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
        var _this = this;
        _this.setData({
            owner_id: options.owner_id,
            name: options.name
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