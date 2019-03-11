// components/multiPhotoUpload/multiPhotoUpload.js
const app = getApp();
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
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    uploading: false,
    sucUplodImg: [],
    c_val: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 提交
    reviewSubmit() {
      if (this.data.selectedImages.length > 0) {
        console.log(this.data.selectedImages)
        this.uploadImage(this, 0);
      }
    },
    // 上传图片
    uploadImage(_this, i) {
      _this.setData({
        uploading: true
      });
      let uploadImgName = _this.data.selectedImages[i].replace('http://tmp/', '');
      let imageObject = 'owner/rentAgreement/' + uploadImgName;
      app.Util.network.POST({
        url: app.globalData.BASE_UPLOAD_URL + "/" + 'object' + '/' + 'upload' + '/' + 'private',
        filePath: _this.data.selectedImages[i],
        name: 'file',
        params: {
          method: 'upload',
          file: 'user',
          data: JSON.stringify({
            bucket_name: 'marvin-api-asset',
            object: imageObject,
          })
        },
        this: _this,
        success: res => {
          let data = JSON.parse(res.data)
          if (data.sub_code == "SUCCESS") {
            _this.setData({
              uploading: false,
              [`sucUplodImg[${i}]`]: '' + data.result.object
            })
            const myEventDetail = {
              uploadState: true,
              sucUplodImg: _this.data.sucUplodImg
            };
            _this.triggerEvent('currentState', myEventDetail)
            if (i < _this.data.selectedImages.length - 1) {
              i++;
              _this.uploadImage(_this, i);
            }
            
            
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
          this.reviewSubmit();
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
      console.log(e);
      var _this = this
      var index = e.currentTarget.dataset.index;
      _this.data.selectedImages.splice(index, 1);
      _this.data.sucUplodImg.splice(index, 1)
      this.setData({
        selectedImages: _this.data.selectedImages
      });
      if(index==0){
        var myEventDetail = {
          uploadState: false,
          sucUplodImg: _this.data.sucUplodImg
        };
      } else {
        var myEventDetail = {
          uploadState: true,
          sucUplodImg: _this.data.sucUplodImg
        };
      }
      _this.triggerEvent('currentState', myEventDetail)
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