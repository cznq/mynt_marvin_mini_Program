// pages/mall-comment/mall-comment.js
var md5 = require('../../../utils/md5.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commerce_id: null,
    selectedImages: [],
    uploading: false,
    uploadImagesLimit: 9,
    rate: -1,
    content: null,
    formReady: false,
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.commerce_id);
    var self = this;
    self.setData({
      commerce_id: options.commerce_id
    })

  },

  // 图片选择
  selectImage() {
    if (this.data.uploading) {
      return;
    }
    wx.chooseImage({
      count: this.data.uploadImagesLimit - this.data.selectedImages.length,
      sizeType: 'compressed',
      success: res => {
        for (var i in res.tempFilePaths) {
          this.data.selectedImages.push(res.tempFilePaths[i]);
        }
        this.setData({
          selectedImages: this.data.selectedImages
        });
      }
    })
  },

  /**
   * 监听表单提交状态
   */
  monitorInput: function(e) {
    if (e.detail.value !== '') {
      this.setData({
        formReady: true
      });
    }
    if (this.data.formReady && this.data.rate !== -1) {
      this.setData({
        disabled: false
      });
    }
  },

  // 评星点击
  rateChange(e) {
    var rate = e.currentTarget.dataset.rate;
    this.setData({
      rate: rate
    });
    if (this.data.formReady && this.data.rate !== -1) {
      this.setData({
        disabled: false
      });
    }
  },

  // 全屏看图
  previewImage(e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.selectedImages[index],
      urls: this.data.selectedImages
    })
  },

  // 移除图片
  removeImage(e) {
    var index = e.currentTarget.dataset.index;
    this.data.selectedImages.splice(index, 1);
    this.setData({
      selectedImages: this.data.selectedImages
    });
  },

  // 提交评价
  reviewSubmit(e) {
    if (this.data.uploading) {
      return;
    }
    if (this.data.rate == -1) {
      wx.showToast({
        icon: 'none',
        title: '请选择评星'
      })
      return;
    }
    if (e.detail.value.content.length == 0) {
      wx.showToast({
        title: '请输入评价内容'
      })
      return;
    }
    this.setData({
      content: e.detail.value.content
    });
    if (this.data.selectedImages.length > 0) {
      this.uploadImage(0);
    } else {
      this.submit(e.detail.value.content);
    }
  },

  // 提交
  submit() {
    var that = this;
    console.log(that.data.selectedImages);
    app.request.requestApi.post({
      url: app.globalData.BANQUET_API_URL + "/comment/add_comment",
      params: {
        data: JSON.stringify({
          commerce_id: that.data.commerce_id,
          user_nickname: wx.getStorageSync('nickname'),
          user_avatar_url: wx.getStorageSync('avatar'),
          pic_url: that.data.selectedImages,
          comment: that.data.content,
          score: that.data.rate + 1
        })
      },
      success: data => {
        that.reviewDone();
      },
      fail: data => {
        wx.showToast({
          icon: 'none',
          title: data.message
        })
      }
    });

  },

  // 上传图片
  uploadImage(i) {
    var that = this;
    var service = 'commerce';
    var data = JSON.stringify({});
    var method = 'upload_comment_file';
    var app_id = app.globalData.SIGN_DATA.app_id;
    var timestamp = Math.round(new Date().getTime() / 1000 - 28800);
    var sign_type = 'MD5';
    var stringA = 'app_id=' + app_id + '&data=' + data + '&timestamp=' + timestamp;
    var sign = md5.hex_md5(stringA + '&key=' + app.globalData.SIGN_DATA.key);
    that.setData({
      uploading: true
    });
    var uploadTask = wx.uploadFile({
      url: app.globalData.BANQUET_API_URL + "/comment/upload_comment_file",
      filePath: that.data.selectedImages[i],
      header: {
        'content-type': 'multipart/form-data'
      },
      name: 'file',
      formData: {
        union_id: wx.getStorageSync('xy_session'),
        app_id: app_id,
        timestamp: timestamp,
        sign_type: sign_type,
        sign: sign,
        data: data
      },
      success: res => {
        var data = JSON.parse(res.data);
        that.setData({
          [`selectedImages[${i}]`]: data.result.comment_pic
        })
        if (i < that.data.selectedImages.length - 1) {
          i++;
          that.uploadImage(i);
        } else {
          that.submit(that.data.content);
        }
      },
      fail: res => {
        wx.showToast({
          title: '上传失败'
        })
        that.setData({
          ['progress[' + i + ']']: false
        });
      }
    })
    uploadTask.onProgressUpdate(res => {
      that.setData({
        ['progress[' + i + ']']: res.progress
      });
    })
  },

  // 评价完成
  reviewDone() {
    wx.showToast({
      title: '提交成功',
      success: () => {
        setTimeout(() => {
          wx.navigateBack();
        }, 1500)
      }
    })
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

  }

})