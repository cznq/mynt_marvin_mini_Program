// pages/supportCenter/introduce/index.js
const app = getApp();
var toast = require('../../../../templates/showToast/showToast');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        titleBannerUrl: "",
        playingIndex: 0,
        currentIndex: 1,
        imageList: {},
        videoList: {},
        topHeight: 0,
        currentScroll: 0,
        tabFixed: false,
        showCoverView: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let _this = this;
        let helpCenterId = options.centerid;
        _this.initData(helpCenterId);
    },
    // onload初始化数据
    initData: function(helpCenterId) {
        let _this = this;
        app.Util.network.POST({
            url: app.globalData.BASE_API_URL,
            params: {
                service: 'building',
                method: 'get_help_center_detail',
                data: JSON.stringify({
                    union_id: wx.getStorageSync('xy_session'),
                    help_center_id: helpCenterId
                })
            },
            success: res => {
                console.log(res.data);
                if (res.data.sub_code == 0 && res.data.result) {
                    let ret = res.data.result;
                    _this.setData({
                        titleBannerUrl: ret.help_list.title_banner_url,
                        imageList: ret.help_list.image_intro_list,
                        videoList: ret.help_list.video_intro_list
                    });
                } else {
                    toast.showToast(this, {
                        toastStyle: 'toast',
                        title: res.data.sub_msg,
                        duration: 1000,
                        mask: false,
                    });
                }
            },
            fail: res => {
                console.log('fail');
            }
        })
        _this.getOffsetTop();
        console.log(_this.data);
    },
    onPageScroll: function(e) {
        let _this = this;
        _this.setData({
            currentScroll: e.scrollTop
        })
        _this.setFixTab(e);
    },
    getOffsetTop() {
        var _this = this;
        const query = wx.createSelectorQuery();
        query.select('#selTab').boundingClientRect();
        query.selectViewport().scrollOffset();
        query.exec(function(res) {
            console.log(res[0]);
            _this.setData({
                topHeight: res[0].height,
            })
        })
    },
    //点击tab切换
    tabClick: function(e) {
        var _this = this;
        _this.setData({
            currentIndex: e.currentTarget.dataset.idx
        });
        if (_this.data.currentScroll < _this.data.topHeight) {
            _this.setData({
                tabFixed: false,
                showCoverView: false
            });
        } else {
            _this.setData({
                tabFixed: true,
                showCoverView: _this.data.currentIndex == 2 ? true : false,
            });
        }
    },
    // 根据当前滚动条高度和tab选项卡设置tab的固定位置
    setFixTab: function(e) {
        let _this = this;
        if (e.scrollTop < _this.data.topHeight) {
            _this.setData({
                tabFixed: false,
                showCoverView: false
            });
        } else {
            _this.setData({
                tabFixed: true,
                showCoverView: _this.data.currentIndex == 2 ? true : false,
            });
        }
    },
    // 播放视频
    videoPlay: function(e) {
        let _this = this;
        let clickPlay = e.currentTarget.dataset.idx;
        if (clickPlay != _this.data.playingIndex) {
            let videoContentPrev = wx.createVideoContext(`video${_this.data.playingIndex}`);
            videoContentPrev.pause();
            _this.setData({
                playingIndex: clickPlay
            });
            let videoContent = wx.createVideoContext(`video${clickPlay}`);
            videoContent.play();
        }
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