// components/uploadRoomProve/uploadRoomProve.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    uploadImage: {
      type: String,
      value: ''
    },
    c_val: {
      type: Number,
      value: 0
    },
    model: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // c_val: 60
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //上传图片
    uploadImage() {
      let that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          let uploadImage = tempFilePaths[0];
          that.setData({
            uploadImage: uploadImage,
            model: 2
          })
          const uploadTask = wx.uploadFile({
            url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              user: 'test'
            },
            success(res) {
              const data = res.data
              // do something
            }
          })

          uploadTask.onProgressUpdate((res) => {
            console.log('上传进度', res.progress)
            console.log('已经上传的数据长度', res.totalBytesSent)
            console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          })

        }
      })
    },
    forbid() {
      console.log(4444);
      return false
    }
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      var that = this;
      if (this.data.model === 2) {
        that.canvasRing = that.selectComponent("#canvasRing");
        that.canvasRing.showCanvasRing();
      }

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