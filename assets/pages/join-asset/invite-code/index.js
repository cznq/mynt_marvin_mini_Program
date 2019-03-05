// pages/join-asset/invite-code/index.js
Page({
    data: {
        mainTitle: '输入邀请码',
        hint: '公司码需向楼宇管理申领\n服务热线：0571-82617637',
        button_text: '确认',
        codevalue: '',
        isfocus: true,
        position: 'fixed',
        disabled: true
    },
    bindfocus(e) {
        let _this = this;
        _this.setData({
            position: 'static',
            padding: '20rpx'
        })
    },
    bindblur(e) {
        let _this = this;
        _this.setData({
            position: 'fixed',
            padding: 0
        })
    },
    confirmCode(e) {
        var company_verify_code = e.detail.value.code;
        var _this = this;
        app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
                service: 'company',
                method: 'get_company_info',
                data: JSON.stringify({
                    company_verify_code: company_verify_code,
                })
            },
            success: res => {
                console.log('get_company_info API return:')
                console.log(res);
                if (res.data.sub_code == 0) {
                    wx.redirectTo({
                        url: '../enterRealName/index?company_verify_code=' + company_verify_code + '&company_name=' + res.data.result.company_name + '&company_short_name=' + res.data.result.company_short_name,
                    })
                } else {
                    _this.setData({
                        isfocus: false
                    })
                    toast.showToast(this, {
                        toastStyle: 'toast',
                        title: '你输入的码有误,请重新输入',
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
    },
    companyCode(e) {
        var _this = this;
        var reg = /[\u4e00-\u9fa5]/g;
        var codevalue = e.detail.value.replace(/\s/ig, '');
        if (app.Util.checkCode(codevalue) == true) {
            var codevalue = e.detail.value.replace(reg, "");
            _this.setData({
                codevalue: codevalue
            })
        }
        //判断公司码8位输入完请求
        if (codevalue.length == 8) {
            _this.setData({
                disabled: false
            })
        } else {
            _this.setData({
                disabled: true
            })
        }
    }
})