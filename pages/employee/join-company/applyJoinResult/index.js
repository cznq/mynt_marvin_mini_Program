var app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({
    data: {
        web_url: app.globalData.WEB_VIEW_URL,
        applySuccess: false,
        company_code: null,
    },
    onLoad: function(options) {
        console.log(options);
        var _this = this;
        var company_code =
            _this.setData({
                company_code: options.company_code
            });
        if (options.result) {
            _this.setData({
                applySuccess: true
            });
        } else {
            _this.setData({
                applySuccess: false
            });
        }
    },
    viewCompany: function() {
        wx.reLaunch({
            url: '../../../manage/manage',
        })
    }
})