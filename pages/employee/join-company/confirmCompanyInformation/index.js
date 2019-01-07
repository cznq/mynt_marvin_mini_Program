var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({
    data: {
        mainTitle: '确认加入此公司',
        button_text: '提交申请',
        hint: '二维码与邀请码来自于企业内部人员的分享,可\n向企业员工或管理员索要',
        company_code: '',
        showLoginModal: false,
        invite_info: true
    },
    onLoad: function(options) {
        var _this = this;
        //检测登陆
        _this.get_info();
        if (!options.company_code) {
            _this.data.company_code = decodeURIComponent(options.scene);
        } else {
            _this.data.company_code = options.company_code;
        }

    },
    get_info: function() {
        var _this = this;
        app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
                service: 'company',
                method: 'get_review_status',
                data: JSON.stringify({
                    union_id: wx.getStorageSync('xy_session')
                })
            },
            success: res => {
                console.log(res);
                var resdata = res.data.result;
                if (res.data.sub_code == 0) {
                    if (resdata.employee_status === 2 || resdata.employee_status === 0) {
                        // if (resdata.employee_status === 10 || resdata.employee_status === 10) {
                        wx.reLaunch({
                            url: '../../../manage/manage',
                        })
                    } else {
                        app.Util.network.POST({
                            url: app.globalData.BASE_API_URL,
                            params: {
                                service: 'company',
                                method: 'get_company_info',
                                data: JSON.stringify({
                                    union_id: wx.getStorageSync('xy_session'),
                                    company_code: _this.data.company_code
                                })
                            },
                            success: res => {
                                console.log(res);
                                if (res.data.sub_code == 0) {
                                    console.log('数据成功');
                                    _this.setData({
                                        cd: res.data.result
                                    })
                                } else {
                                    console.log(res.data.sub_msg);
                                    toast.showToast(this, {
                                        toastStyle: 'toast',
                                        title: res.data.sub_msg,
                                        duration: 1000,
                                        mask: false,
                                        cb: function() {
                                            wx.reLaunch({
                                                url: '../choiceJoin/index',
                                            })
                                        }
                                    });
                                }
                            },
                            fail: res => {
                                console.log('fail');
                            }
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

    receiveSubmit: function(e) {
        var _this = this;
        var realName = e.detail.value.name;
        var applicationReason = e.detail.value.reason;
        var formId = e.detail.formId;
        var formId = '123123123dfsdf';
        if (realName !== '') {
            app.Util.network.POST({
                url: app.globalData.BASE_API_URL,
                params: {
                    service: 'company',
                    method: 'apply_join',
                    data: JSON.stringify({
                        company_code: _this.data.company_code,
                        union_id: wx.getStorageSync('xy_session'),
                        open_id: wx.getStorageSync('open_id'),
                        name: realName,
                        form_id: formId,
                        avatar: wx.getStorageSync('avatar'),
                        open_id_type: app.globalData.open_id_type,
                        application_reason: applicationReason
                    })
                },
                success: res => {
                    console.log(res);
                    if (res.data.sub_code == 0) {
                        wx.redirectTo({
                            url: '../applyJoinResult/index?company_code=' + _this.data.company_code + '&result=' + true
                        })
                    } else if (res.data.sub_code == 100027 || res.data.sub_code == 100035) {
                        wx.redirectTo({
                            url: '../applyJoinResult/index?company_code=' + _this.data.company_code
                        })
                    } else {
                        console.log(res.data.sub_msg);
                        toast.showToast(this, {
                            toastStyle: 'toast',
                            title: res.data.sub_msg,
                            duration: 2000,
                            mask: false,
                            cb: function() {
                                _this.setData({
                                    isfocus: true
                                })
                            }
                        });
                    }
                },
                fail: res => {
                    console.log('fail');
                }
            })
        } else {
            toast.showToast(this, {
                toastStyle: 'toast',
                title: '姓名不能为空哦',
                duration: 2000,
                mask: false,
                cb: function() {
                    _this.setData({
                        isfocus: true
                    })
                }
            });
        }
    }
})