var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '上传企业资料',
    button_text: '提交',
    hint: '以下资料需经过楼宇管理员审核，严禁上传色情、\n暴力、血腥、骇人或政治相关内容的图片',
    cd: {},
    isSowingMapUp: false
  },
  next: function() {
    wx.navigateTo({
      url: '../success/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.Util.checkcanIUse('cover-view'); //础库 1.4.0 开始支持
 
    /** ===== test data ====*/
    var resdata = {
      //请求接口
      "company_id": 1,
      "company_name": "轻客智能科技(江苏)有限公司",
      "company_short_name": "轻客",
      "name_alias": [
        "轻客智能",
        "小觅公司"
      ],
      "logo": "http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/111.jpg",
      "introduction": "轻客智能",
      "floor": 19,
      "room": "1909",
      "video_url": "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
      "background_url": "",
      "address": "北京市浦项中心A座3201",
      "website": "http://www.slightech.com",
      "phone": '17600406831',
      "product_urls": [],
      "company_code": "1234",
      "review_status": 1,
      "has_employee_benefit": 0
    }
    /** ===== test data ====*/

    that.setData({
      cd: resdata
    })

    if (resdata.product_urls.length < 6) {
      that.setData({
        isSowingMapUp: true
      })
    }

  },
  //单张删除图片
  bindclearpic: function(e) {
    var that = this;
    var c_key = e.currentTarget.dataset.key;
    if (typeof c_key == 'number') {
      //轮播图
      that.data.cd.product_urls.splice(c_key, 1);
      console.log('-------' + typeof that.data.cd.product_urls);
      that.setData({
        "cd.product_urls": that.data.cd.product_urls
      })
      if (that.data.cd.product_urls.length < 6) {
        that.setData({
          isSowingMapUp: true
        })
      }
    } else {
      //其他
      var name = 'cd.' + c_key;
      that.setData({
        [name]: ''
      })
    }
  },

  //上传图片
  uploadimages: function(e) {
    var that = this;
    var c_key = e.currentTarget.dataset.key; //获取栏目
    var name = 'cd.' + c_key; //拼接对象
    var num = 1; //上传图片数量
    if (c_key == 'product_urls') { //轮播图
      var num = 6 - that.data.cd.product_urls.length; //可上传数量
    }
    that.upimage(this, num, name);
  },
  upimage: function(that, num, name) {
    wx.chooseImage({
      count: num,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        if (name == 'cd.product_urls') { //轮播图
          for (var i in res.tempFilePaths) {
            that.data.cd.product_urls.push(res.tempFilePaths[i]);
          }
          if (that.data.cd.product_urls.length >= 6) {
            that.setData({
              isSowingMapUp: false
            })
          }
          that.setData({
            [name]: that.data.cd.product_urls
          })
        } else { //其他
          that.setData({
            [name]: tempFilePaths
          })
        }
      }
    })
  },
  //提交
  submit: function() {
    var that = this;
    console.log('logo' + that.data.cd.logo.length);
    console.log('background_url' + that.data.cd.background_url.length);
    console.log('background_url' + that.data.cd.product_urls.length);
    console.log('video_url' + that.data.cd.video_url.length);

    if (that.data.cd.logo.length !== 0 && that.data.cd.background_url.length !== 0 && that.data.cd.product_urls.length !== 0 && that.data.cd.video_url.length !== 0) {
      
      //请求接口
      console.log('可以通过');
      wx.redirectTo({
        url: '../success/index',
      })

    } else {
      console.log('tishicuowu');
      toast.showToast(this, {
        toastStyle: 'toast',
        title: '填的还不完整哦',
        duration: 1500,
        mask: false
      });
    }
  },
  onReady() {
    this.videoCtx = wx.createVideoContext('myVideo')
  },
  play() {
    this.videoCtx.play()
  },
  pause() {
    this.videoCtx.pause()
  }
})