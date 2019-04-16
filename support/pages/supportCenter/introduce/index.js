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
    topHeight: null,
    tabFixed: false,
    showCoverView: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    let helpCenterId = options.centerid;
    var _this = this;
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'building',
        method: 'get_help_center_detail',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
          help_center_id: helpCenterId
        })
        _this.getOffsetTop();
        console.log(_this.data);
      },
      onPageScroll: function(e) {
        var _this = this;
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
        this.setData({
          currentIndex: e.currentTarget.dataset.idx
        })
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
      fail: res => {
        console.log('fail');
      }
    })
    _this.getOffsetTop();
  },
  onPageScroll: function(e) {
    var _this = this;
    if (e.scrollTop < _this.data.taboffsetTop) {
      _this.setData({
        tabFixed: false
      });
      console.log(_this.data.tabFixed);
    } else {
      _this.setData({
        tabFixed: true
      });
      console.log(_this.data.tabFixed);
    }
  },
  getOffsetTop() {
    var _this = this;
    const query = wx.createSelectorQuery()
    query.select('#selTab').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      _this.setData({
        taboffsetTop: res[0].top
      })
    })
  },
  //点击tab切换
  tabClick: function(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.idx
    })
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