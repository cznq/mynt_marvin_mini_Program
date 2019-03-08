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
      value: 90
    },
    direction: {
      type: String,
      value: "row"
    },
    tipTxt: {
      type: String,
      value: "上传房产证"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    model: 1,
    c_val: 45,
    ImgHeig: 0,
    ImgWid: 0
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
          //获取图片信息
          wx.getImageInfo({
            src: uploadImage,
            success(res) {
              if (that.data.direction === "row") {
                if (res.width > res.height) {
                  let scale = 576 / res.width
                  let height = res.height * scale
                  let width = 576
                  if (height > 384) {
                    scale = 384 / height
                    width = width * scale
                    height = 384
                  }
                  that.setData({
                    ImgWid: width,
                    ImgHeig: height
                  })
                } else if (res.width < res.height) {
                  let scale = 384 / res.height
                  let width = res.width * scale
                  let height = 384
                  that.setData({
                    ImgWid: width,
                    ImgHeig: height
                  })
                }
              } else {
                if (res.width > res.height) {
                  let scale = 430 / res.width
                  let height = res.height * scale
                  let width = 430
                  if (height > 620) {
                    scale = 620 / height
                    width = width * scale
                    height = 620
                  }
                  that.setData({
                    ImgWid: width,
                    ImgHeig: height
                  })
                } else if (res.width < res.height) {
                  let scale = 620 / res.height
                  let width = res.width * scale
                  let height = 620
                  if (width > 430) {
                    scale = 430 / height
                    width = width * scale
                    height = 430
                  }
                  that.setData({
                    ImgWid: width,
                    ImgHeig: height
                  })
                }
              }
              console.log('this.data.ImgWid', that.data.ImgWid);
              console.log('this.data.ImgHeig', that.data.ImgHeig);
            }
          })

          that.setData({
            uploadImage: uploadImage,
            model: 2
          })
          that.selectComponent("#canvasRing").showCanvasRing();;

          // const uploadTask = wx.uploadFile({
          //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
          //   filePath: tempFilePaths[0],
          //   name: 'file',
          //   formData: {
          //     user: 'test'
          //   },
          //   success(res) {
          //     const data = res.data
          //     // do something
          //   }
          // })
          //
          // uploadTask.onProgressUpdate((res) => {
          //   console.log('上传进度', res.progress)
          //   console.log('已经上传的数据长度', res.totalBytesSent)
          //   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          // })

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