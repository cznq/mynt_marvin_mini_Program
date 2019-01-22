// pages/visitor-list/list/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        timeChoose: false,
        typeChoose: false,
        timeText: '全部时间',
        typeText: '全部类型',
        visitor_type: 0,
        time_range: 0,
        page: 1,
        list: {},
        noneData: {
            textInfo: '暂无数据',
            buttonText: '邀请访客',
            emptyBtnFunc: 'emptyButton',
            show: false
        }
    },
    timeChooseState: function() {
        let timeChoose = this.data.timeChoose;
        let _this = this;
        if (timeChoose) {
            _this.setData({
                timeChoose: false,
                typeChoose: false,
            })
        } else {
            _this.setData({
                timeChoose: true,
                typeChoose: false,
            })
        }
    },
    seleTime: function(e) {
        let seleTime = e.target.dataset.name;
        let _this = this;
        switch (seleTime) {
            case 'typeChoose':
                var timeText = "全部时间";
                var time_range = 0;
                break;
            case 'today':
                var timeText = "今天";
                var time_range = 1;
                break;
            case 'week':
                var timeText = "本周";
                var time_range = 2;
                break;
            case 'month':
                var timeText = "本月";
                var time_range = 3;
                break;
            default:
                var timeText = "全部时间";
                var time_range = 0;
                break;
        }
        _this.setData({
            seleTime: seleTime,
            timeText: timeText,
            time_range: time_range
        }, () => {
            _this.showList();
        });
    },
    typeChooseState: function() {
        let _this = this;
        let typeChoose = this.data.typeChoose;
        if (typeChoose) {
            _this.setData({
                typeChoose: false,
                timeChoose: false
            })
        } else {
            _this.setData({
                typeChoose: true,
                timeChoose: false
            })
        }
    },
    seleType: function(e) {
        let seleType = e.target.dataset.name;
        let _this = this;
        switch (seleType) {
            case 'timeChoose':
                var typeText = "全部类型";
                var visitor_type = 0;
                break;
            case 'invType':
                var typeText = "预约访客";
                var visitor_type = 1;
                break;
            case 'tmpType':
                var typeText = "临时访客";
                var visitor_type = 2;
                break;
            default:
                var typeText = "全部类型";
                var visitor_type = 0;
                break;
        }
        _this.setData({
            seleType: seleType,
            typeText: typeText,
            visitor_type: visitor_type
        }, () => {
            _this.showList();
        });
    },
    // 调取接口查询访客列表
    showList: function() {
        console.log(123);
    },
    // 搜索
    startSearchInput: function() {
        let _this = this;
        _this.setData({
            searchModal: true
        });
    },
    searchCancel: function() {
        let _this = this;
        _this.setData({
            searchModal: false
        });
    },
    // 空页面跳转到邀请页
    emptyButton: function() {
        wx.navigateTo({
            url: '/pages/invite-visitor/edit/index',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let _this = this;
        _this.setData({
            page: _this.data.page + 1,
        }, () => {
            _this.showList();
        });
        console.log(_this.data);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
})