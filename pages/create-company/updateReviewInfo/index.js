var app = getApp();
var toast = require('../../../templates/showToast/showToast');
var md5 = require('../../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '上传企业资料',
    button_text: '提交',
    hint: '以下资料需经过楼宇管理员审核，严禁上传色情、\n暴力、血腥、骇人或政治相关内容的图片',
    cd: {},
    isSowingMapUp: false,
    mode:'aspectFill'
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
    var _this = this;
    app.Util.checkcanIUse('cover-view'); //检测组件兼容性 础库 1.4.0 开始支持

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
          console.log('请求出错');
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
  },
  //删除图片
  bindclearpic: function(e) {
    var _this = this;
    var c_key = e.currentTarget.dataset.key;//获取对象
    
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
  uploadimages: function(e) {
    var _this = this;
    var c_key = e.currentTarget.dataset.key; //获取栏目
    var name = 'cd.' + c_key; //拼接对象
    var num = 1; //上传图片数量
    if (c_key == 'product_urls') { //轮播图
      var num = 6 - _this.data.cd.product_urls.length; //可上传数量
    }
    _this.upimage(this, num, name);
  },
  upimage: function(_this, num, name) {
    wx.chooseImage({
      count: num,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        console.log('---');
        console.log(tempFilePaths);
        //上传图片到oss
       
        var service = 'company';
        var data = JSON.stringify({});
        var method = 'upload_file';
        var app_id = '65effd5a42fd1870b2c7c5343640e9a8';
        var timestamp = Math.round(new Date().getTime() / 1000 - 28800);
        var sign_type = 'MD5';
        var stringA = 'app_id=' + app_id + '&data=' + data + '&method=' + method + '&service=' + service + '&timestamp=' + timestamp;
        var sign = md5.hex_md5(stringA + '&key=a8bfb7a5f749211df4446833414f8f95');


        console.log(service, method, app_id, timestamp, sign_type, stringA, sign);
        console.log(app.globalData.BASE_API_URL);
        
        wx.uploadFile({
          url: app.globalData.BASE_API_URL,
          filePath: tempFilePaths[0],
          name: 'company_pic',
          formData: {
            union_id: wx.getStorageSync('xy_session'),
            service: service,
            method: method,
            app_id: app_id,
            timestamp: timestamp,
            sign_type: sign_type,
            sign: sign,
            data: data
          },
          success: res => {
            console.log(res);

          },
          fail: res => {
            wx.showToast({
              title: '上传失败'
            })

          }
        })







        if (name == 'cd.product_urls') {
          //轮播图
          for (var i in res.tempFilePaths) {
            _this.data.cd.product_urls.push(res.tempFilePaths[i]);
            console.log(res.tempFilePaths[i]);
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
          //logo 宣传背景图 视频
          _this.setData({
            [name]: tempFilePaths
          })
        }
      }
    })
  },
  //上传视频
  uploadvideo: function () {
    var _this = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath);
        _this.setData({
          "cd.video_url": res.tempFilePath
        })
      }
    })
  },
  //提交信息
  submit: function() {
    var _this = this;
    console.log('logo' + _this.data.cd.logo.length);
    console.log('background_url' + _this.data.cd.background_url.length);
    console.log('background_url' + _this.data.cd.product_urls.length);
    console.log('video_url' + _this.data.cd.video_url.length);

    //表单验证
    if (_this.data.cd.logo.length !== 0 && _this.data.cd.background_url.length !== 0 && _this.data.cd.product_urls.length !== 0 && _this.data.cd.video_url.length !== 0) {
      console.log('可以通过');
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
            product_urls:_this.data.cd.product_urls,
            video_url: _this.data.cd.video_url
          })
        },
        success: res => {
          console.log(res);
          if (res.data.sub_code == 0) {
            console.log('数据成功');
            wx.redirectTo({
              url: '../createSuccess/index',
            })
          } else {
            console.log('请求出错');
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
  }
  







})