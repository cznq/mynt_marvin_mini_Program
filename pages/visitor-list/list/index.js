// pages/visitor-list/list/index.js
var app = getApp()
var toast = require('../../../templates/showToast/showToast');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        seleTime: 'timeChoose',
        seleType: 'typeChoose',
        timeChoose: false,
        typeChoose: false,
        timeText: '全部时间',
        typeText: '全部类型',
        visitor_type: 0,
        time_range: 0,
        page: 1,
        total_page: 1,
        list: {},
        sData: {},
        searchModal: false,
        searchFocus: false,
        keyWord: '',
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
                searchModal: false,
                searchFocus: false
            })
        } else {
            _this.setData({
                timeChoose: true,
                typeChoose: false,
                searchModal: false,
                searchFocus: false
            })
        }
    },
    seleTime: function(e) {
        let seleTime = e.target.dataset.name;
        let _this = this;
        switch (seleTime) {
            case 'timeChoose':
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
            time_range: time_range,
            searchModal: false,
            searchFocus: false,
            page: 1,
            list: {}
        }, () => {
            _this.showList('cover');
        });
    },
    typeChooseState: function() {
        let _this = this;
        let typeChoose = this.data.typeChoose;
        if (typeChoose) {
            _this.setData({
                typeChoose: false,
                timeChoose: false,
                searchModal: false,
                searchFocus: false,
            })
        } else {
            _this.setData({
                typeChoose: true,
                timeChoose: false,
                searchModal: false,
                searchFocus: false
            })
        }
    },
    seleType: function(e) {
        let seleType = e.target.dataset.name;
        let _this = this;
        switch (seleType) {
            case 'typeChoose':
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
            visitor_type: visitor_type,
            searchModal: false,
            searchFocus: false,
            page: 1,
            list: {}
        }, () => {
            _this.showList('cover');
        });
    },
    // 搜索
    showSearch: function() {
        let _this = this;
        _this.setData({
            searchModal: true,
            searchFocus: true,
            timeChoose: false,
            typeChoose: false,
            sData: {},
            'noneData.show': false
        });
    },
    searchCancel: function() {
        let _this = this;
        _this.setData({
            searchModal: false,
            searchFocus: false,
            keyWord: '',
            'noneData.show': _this.data.list.length ? false : true
        });
    },
    searchInput: function(e) {
        let keyWord = e.detail.value;
        let _this = this;
        if (keyWord.length == 0) {
            _this.setData({
                searchModal: false,
                searchFocus: false,
                keyWord: '',
                'noneData.show': _this.data.list.length ? false : true
            });
        } else {
            _this.setData({
                keyWord: keyWord
            }, _this.showList('cover'));
        }
    },
    searchSubmit: function(e) {
        let keyWord = e.detail.value;
        let _this = this;
        if (keyWord.length == 0) {
            _this.setData({
                keyWord: keyWord
            });
        } else {
            _this.setData({
                keyWord: keyWord
            }, _this.showList('cover'));
        }
    },
    // 调取接口查询访客列表
    showList: function(dtype) {
        let _this = this;
        app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
                service: 'company',
                method: 'get_info',
                data: JSON.stringify({})
            },
            success: res => {
                console.log("获取公司信息:", res.data);
                if (res.data.sub_code == 0) {
                    var company_id = res.data.result.company_id;
                    app.Util.network.POST({
                        url: app.globalData.BASE_API_URL,
                        params: {
                            service: 'visitor',
                            method: 'get_visitor_list',
                            data: JSON.stringify({
                                company_id: company_id,
                                time_range: _this.data.time_range,
                                visitor_type: _this.data.visitor_type,
                                page: _this.data.page,
                                visitor_name: _this.data.keyWord,
                            })
                        },
                        success: res => {
                            console.log("获取访客信息:", res.data.result);
                            if (res.data.sub_code == 0) {
                                let rtData = res.data.result;
                                if (rtData.count == 0) {
                                    _this.setData({
                                        'noneData.show': true,
                                    });
                                } else {
                                    _this.setData({
                                        'noneData.show': false,
                                    });
                                    // 如果搜索条件不为空则放入搜素对象内,否则放入正常数据对象
                                    if (_this.data.keyWord.length != 0) {
                                        if (dtype == 'cover') {
                                            _this.setData({
                                                totalPage: rtData.total_page,
                                                sData: rtData.data
                                            })
                                        } else {
                                            _this.setData({
                                                totalPage: rtData.total_page,
                                                page: _this.data.page + 1,
                                                sData: _this.data.sData.concat(rtData.data)
                                            })
                                        }
                                    } else {
                                        if (dtype == 'cover') {
                                            _this.setData({
                                                totalPage: rtData.total_page,
                                                list: rtData.data
                                            })
                                        } else {
                                            _this.setData({
                                                totalPage: rtData.total_page,
                                                page: _this.data.page + 1,
                                                list: _this.data.list.concat(rtData.data)
                                            })
                                        }
                                    }
                                }
                            } else {
                                _this.setData({
                                    'noneData.show': true,
                                });
                            }
                        },
                        fail: res => {
                            console.log(res);
                        }
                    })
                }
            },
            fail: res => {
                console.log(res);
            }
        })
    },
    visitDetail: function(e) {
        let jumpData = e.currentTarget.dataset;
        let avatar = jumpData.avatar,
            note = jumpData.note,
            time = jumpData.time,
            visitor = jumpData.visitor;
        wx.navigateTo({
            url: '../detail/index?avatar=' + avatar + '&note=' + note + '&time=' + time + '&visitor=' + visitor
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;
        _this.showList('cover');
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
        if (_this.data.total_page <= _this.data.page) {
            return false;
        }
        _this.showList('add');
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
})