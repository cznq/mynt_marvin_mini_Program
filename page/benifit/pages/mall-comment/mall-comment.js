// pages/mall-comment/mall-comment.js
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
    rate: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      commerce_id: options.commerce_id
    })
    
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        
      })
    } else {
      
    }
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

  // 评星点击
  rateChange(e) {
    var rate = e.currentTarget.dataset.rate;
    console.log(rate);
    this.setData({
      rate: rate
    });
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

  // 提交
  submit(content) {
    var that = this;
    if (content.length == 0) {
      wx.showToast({
        title: '请输入评价内容'
      })
      return;
    }
    that.setData({
      uploading: true
    });
    app.Util.network.POST({
      url: app.globalData.BENIFIT_API_URL,
      params: {
        service: 'commerce',
        method: 'add_comment',
        union_id: wx.getStorageSync('xy_session'),
        data: JSON.stringify({
          commerce_id: that.data.commerce_id,
          user_nickname: wx.getStorageSync('nickname'),
          user_avatar_url: wx.getStorageSync('avatar'),
          pic_url: that.data.selectedImages,
          comment: content,
          score: that.data.rate + 1
        })
      },
      success: data => {
        if (this.data.selectedImages.length > 0) {
          this.uploadImage(0, data.id);
        } else {
          this.reviewDone();
        }
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
  uploadImage(i, commentID) {
    var that = this;
    var service = 'visitor';
    var data = JSON.stringify({
      company_id: that.data.company_id
    });
    var method = 'upload_face_pic';
    var app_id = '65effd5a42fd1870b2c7c5343640e9a8';
    var timestamp = Math.round(new Date().getTime() / 1000 - 28800);
    var sign_type = 'MD5';
    var stringA = 'app_id=' + app_id + '&data=' + data + '&method=' + method + '&service=' + service + '&timestamp=' + timestamp;
    var sign = md5.hex_md5(stringA + '&key=a8bfb7a5f749211df4446833414f8f95');

    var uploadTask = wx.uploadFile({
      url: app.API('product_review_image'),
      filePath: this.data.selectedImages[i],
      formData: {
        w2w_session: app.data.w2w_session,
        comment_id: commentID
      },
      name: 'image',
      success: res => {
        console.log(res);
        if (i < this.data.selectedImages.length - 1) {
          i++;
          this.uploadImage(i, commentID);
        } else {
          this.reviewDone();
        }
      },
      fail: res => {
        wx.showToast({
          title: '上传失败'
        })
        this.setData({
          ['progress[' + i + ']']: false
        });
      }
    })
    uploadTask.onProgressUpdate(res => {
      this.setData({
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
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  }

})