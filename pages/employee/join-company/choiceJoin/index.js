var app = getApp();
Page({
    data: {
        mainTitle: '选择一种方式加入',
        button_text: '下一步',
        hint: '二维码与邀请码来自于企业内部人员的分享,可向企业员工或管理员索要'
    },
    bindcode: function() {
        wx.navigateTo({
            url: '../invitationCode/index',
        })
    },
    bindscan: function() {
        var _this = this;
        //呼起扫一扫
        wx.scanCode({
            onlyFromCamera: true,
            success(res) {
                console.log(res.path);
                wx.navigateTo({
                    url: '/' + res.path,
                    //url:'../confirmCompanyInformation/index?scene=GERW1XWQ',
                })
            }
        })
    }
})