// components/multiPhotoUpload/multiPhotoUpload.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '上传租赁合同'
    },
    intro: {
      type: String,
      value: '上传的图片需要体现合同期限、资产明细、双方签名'
    },
    selectedImages: {
      type: Array,
      value: []
    },
    uploadImagesLimit: {
      type: Number,
      value: 9
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    uploading: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 提交
    reviewSubmit(e) {
      if (this.data.selectedImages.length > 0) {
        this.uploadImage(this, 0);
      }
    },
    // 上传图片
    uploadImage(_this, i) {
      var service = 'commerce';
      var data = JSON.stringify({});
      var method = 'upload_comment_file';
      var app_id = '65effd5a42fd1870b2c7c5343640e9a8';
      var timestamp = Math.round(new Date().getTime() / 1000 - 28800);
      var sign_type = 'MD5';
      var stringA = 'app_id=' + app_id + '&data=' + data + '&method=' + method + '&service=' + service + '&timestamp=' + timestamp;
      var sign = md5.hex_md5(stringA + '&key=a8bfb7a5f749211df4446833414f8f95');
      _this.setData({
        uploading: true
      });
      var uploadTask = wx.uploadFile({
        url: app.globalData.BENIFIT_API_URL,
        filePath: _this.data.selectedImages[i],
        header: {
          'content-type': 'multipart/form-data'
        },
        name: 'comment_pic',
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
          var data = JSON.parse(res.data);
          _this.setData({
            [`selectedImages[${i}]`]: data.result.comment_pic
          })
          if (i < _this.data.selectedImages.length - 1) {
            i++;
            _this.uploadImage(i);
          }
        },
        fail: res => {
          wx.showToast({
            title: '上传失败'
          })
          _this.setData({
            ['progress[' + i + ']']: false
          });
        }
      })
      uploadTask.onProgressUpdate(res => {
        _this.setData({
          ['progress[' + i + ']']: res.progress
        });
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
    
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached() {
    // 在组件实例进入页面节点树时执行
  },
  detached() {
    // 在组件实例被从页面节点树移除时执行
  },
})