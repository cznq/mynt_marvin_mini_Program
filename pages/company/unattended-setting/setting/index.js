// pages/company-unattended/index.js
var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShow: true,
        isChecked: false,
        color: '#4EDE7A',
        union_id: wx.getStorageSync('xy_session'),
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _this = this;
        app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
                service: 'company',
                method: 'get_info',
                data: JSON.stringify({
                    union_id: wx.getStorageSync('xy_session')
                })
            },
            success: res => {
                console.log(res);
                if (res.data.sub_code == 0) {
                    if (res.data.result.attend_status == 0) {//有人值守
                        _this.setData({
                            isChecked: false,
                            isShow: true
                        })
                    } else if (res.data.result.attend_status == 1){//无人值守
                        _this.setData({
                            isChecked: true,
                             isShow: false
                        })
                        
                    }
                } else {
                    console.log(res.data.sub_msg);
                }
            },
            fail: res => {
                console.log('fail');
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    bindSwitchChange: function(e) {
        if (!this.data.isChecked) {
            toast.showToast(this, {
                toastStyle: 'toast4',
                title: '自动值守',
                introduce: '开启无人值守，未预约访客取卡无需前台确认，为确保公司安全，请谨慎开启。',
                mask: true,
                isSure: true,
                sureText: '仍然开启',
                isClose: true,
                closeText: '取消'
            });
        } else {
            var _this = this;
            _this.postRequestOwn(0);
            _this.setData({
                isChecked: false,
                isShow: true
            });
        }

    },

    bindToastSure: function(value) {
        var _this = this;
        _this.postRequestOwn(1);
        _this.setData({
            isChecked: true,
            isShow: false
        });
        toast.hideToast();
    },

    bindToastClose: function() {
        var _this = this;
        _this.setData({
            isChecked: false,
            isShow: true
        })
        toast.hideToast();
    },

    postRequestOwn: function(attend_status) {
        app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
                service: 'company',
                method: 'update_attend_status',
                data: JSON.stringify({
                    union_id: this.data.union_id,
                    attend_status: attend_status
                })
            },
            success: res => {
                console.log(res);
            },
            fail: res => {
                console.log('fail');
            }
        })
    }
})