// pages/join-asset/invite-code/index.js
var app = getApp();
var toast = require("../../../../templates/showToast/showToast");
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
        var _this = this;
        var verify_code = e.detail.value.code;
        app.Util.networkUrl.postUrl({
            url: app.globalData.BASE_ASSET_URL + "/owner/get/verify_code",
            params: {
                data: JSON.stringify({
                    union_id: wx.getStorageSync('xy_session'),
                    verify_code: verify_code,
                })
            },
            success: res => {
                console.log('owner-get-verifycode return:');
                console.log(res);
                if (res.data.sub_code == "SUCCESS") {
                    let info = res.data.result;
                    if (info.type == 1) {
                        let url = '../company-info/index?business_contract_pic_urls=' + info.business_contract_pic_urls + '&number=' + info.number + '&paperwork_pic_url=' + info.paperwork_pic_url;
                    } else {
                        let url = '../person-info/index?owner_id=' + info.owner_id + '&owner_id=' + info.owner_id + '&business_contract_pic_urls=' + info.business_contract_pic_urls + '&number=' + info.number + '&paperwork_pic_url=' + info.paperwork_pic_url + '&phone=' + phone;
                    }
                    wx.navigateTo({
                        url: url,
                    });
                } else {
                    _this.setData({
                        isfocus: false
                    })
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