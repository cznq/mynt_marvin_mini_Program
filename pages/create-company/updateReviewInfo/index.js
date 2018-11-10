var app = getApp();
var toast = require('../../../templates/showToast/showToast');
var md5 = require('../../../utils/md5.js');
Page({
  data: {
    mainTitle: '上传企业资料',
    button_text: '提交',
    hint: '以下资料需经过楼宇管理员审核，严禁上传色情、\n暴力、血腥、骇人或政治相关内容的图片',
    cd: {},
    isSowingMapUp: false,
    mode: 'aspectFill',
    isvideoshow:false,
    introduction:''
  },
  next: function () {
    wx.navigateTo({
      url: '../success/index',
    })
  },
  onLoad: function (options) {
    var _this = this;
    app.Util.checkcanIUse('cover-view'); //检测组件兼容性 础库 1.4.0 开始支持
    _this.data.introduction = options.introduction;
    console.log(_this.data.introduction);
    //请求数据
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session'),
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code == 0) {
          var resdata = res.data.result;
          if (res.data.result.product_urls[0] == ""){
            res.data.result.product_urls=[]
          }
          _this.setData({
            cd: resdata
          })
          //轮播图添加图片判断
          if (resdata.product_urls.length < 6) {
            _this.setData({
              isSowingMapUp: true
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
  //删除图片
  bindclearpic: function (e) {
    var _this = this;
    var c_key = e.currentTarget.dataset.key; //获取对象

    if (typeof c_key == 'number') {
      //轮播图
      _this.data.cd.product_urls.splice(c_key, 1);
      _this.setData({
        "cd.product_urls": _this.data.cd.product_urls
      })
      if (_this.data.cd.product_urls.length < 6) {
        _this.setData({
          isSowingMapUp: true
        })
      }
    } else {
      //logo 宣传背景图 视频
      var name = 'cd.' + c_key;
      _this.setData({
        [name]: ''
      })
    }
  },
  //上传图片
  uploadimages: function (e) {
    var _this = this;
    var c_key = e.currentTarget.dataset.key; //获取栏目
    var name = 'cd.' + c_key; //拼接对象

    /** 选择图片参数 */
    var chooseImage_count = 1;
    if (c_key == 'product_urls') {
      var chooseImage_count = 6 - _this.data.cd.product_urls.length;
    }
    var chooseImage_sizeType = ['original', 'compressed'];
    var chooseImage_sourceType = ['album', 'camera'];

    /** 上传到oss服务器参数 */
    var uposs_url = app.globalData.BASE_API_URL;
    var uposs_service = 'company';
    var uposs_method = 'upload_company_multimedia';
    var uposs_name = 'company_multimedia_url';

    //上传图片
    app.Util.uploadImage(_this,chooseImage_count, chooseImage_sizeType, chooseImage_sourceType, uposs_url, uposs_service, uposs_method, uposs_name, function (obj) {
      if (name == 'cd.product_urls') {
        //轮播图
        for (var i in obj) {
          _this.data.cd.product_urls.push(obj[i]);
        }
        if (_this.data.cd.product_urls.length >= 6) {
          _this.setData({
            isSowingMapUp: false
          })
        }
        _this.setData({
          [name]: _this.data.cd.product_urls
        })
      } else {
        //logo 宣传背景图
        _this.setData({
          [name]: obj[0]
        })
      }
    });
  },

  //上传视频
  uploadvideo: function () {
    var _this = this;

    /** 上传到oss服务器参数 */
    var uposs_url = app.globalData.BASE_API_URL;
    var uposs_service = 'company';
    var uposs_method = 'upload_company_multimedia';
    var uposs_name = 'company_multimedia_url';

    /**选择视频参数 */
    var chooseVideo_sourceType = ['album', 'camera'];
    var chooseVideo_compressed = true;
    var chooseVideo_maxDuration = 60;
    var chooseVideo_camera = 'back';

    app.Util.uploadvideo(_this,chooseVideo_sourceType, chooseVideo_compressed, chooseVideo_maxDuration, chooseVideo_camera, uposs_url, uposs_service, uposs_method, uposs_name, function (obj) {
      _this.setData({
        "cd.video_url": obj[0]
      })
      setTimeout(() => {
        _this.setData({
         isvideoshow:true
        })
      }, 500);
    });
  },
  //提交信息
  submit: function () {
    var _this = this;
    //表单验证
    if (_this.data.cd.logo.length == 0) {
      _this.Toast('需要上传公司LOGO')
      return false;
    }
    if (_this.data.cd.background_url.length == 0) {
      _this.Toast('需要上传宣传背景图')
      return false;
    }
    if (_this.data.cd.product_urls.length == 0) {
      _this.Toast('需要上传轮播图')
      return false;
    }

    if (_this.data.cd.logo.length !== 0 && _this.data.cd.background_url.length !== 0 && _this.data.cd.product_urls.length !== 0) {
      //更新
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'update',
          data: JSON.stringify({
            union_id: wx.getStorageSync('xy_session'),
            logo: _this.data.cd.logo,
            background_url: _this.data.cd.background_url,
            product_urls: _this.data.cd.product_urls,
            video_url: _this.data.cd.video_url,
            introduction: _this.data.introduction
          })
        },
        success: res => {
          console.log(res);
          if (res.data.sub_code == 0) {
            console.log('数据成功');
            wx.reLaunch({
              url: '../createSuccess/index',
            })
          } else {
            console.log(res.data.sub_msg);
          }
        },
        fail: res => {
          console.log('fail');
        }
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
  Toast: function (text) {
    toast.showToast(this, {
      toastStyle: 'toast',
      title: text,
      duration: 1500,
      mask: false
    });
  }
})