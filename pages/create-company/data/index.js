// pages/create-company/company-code/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '上传企业资料',
    button_text: '提交',
    hint: '以下资料需经过楼宇管理员审核，严禁上传色情、\n暴力、血腥、骇人或政治相关内容的图片',
    cd:{}
  },
  next: function () {
    wx.navigateTo({
      url: '../success/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /** ===== test data ====*/
    var resdata = {
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
      "video_url": "http://sendcard.slightech.com/video/slightech.mp4",
      "background_url": "http://slightech-marvin-wechat.oss-cn-hangzhou.aliyuncs.com/marvin-mini-program/111.jpg",
      "address": "北京市浦项中心A座3201",
      "website": "http://www.slightech.com",
      "phone": '17600406831',
      "product_urls": [
        "http://sendcard.slightech.com/pic/slightech1.jpg",
        "http://sendcard.slightech.com/pic/slightech2.jpg",
        "http://sendcard.slightech.com/pic/slightech3.jpg",
        "http://sendcard.slightech.com/pic/slightech4.jpg"
      ],
      "company_code": "1234",
      "review_status": 1,
      "has_employee_benefit": 0
    }
    /** ===== test data ====*/

    that.setData({
      cd: resdata
    })
  },
  // 图片选择
  // selectImage() {
  //   if (this.data.uploading) {
  //     return;
  //   }
  //   wx.chooseImage({
  //     count: this.data.uploadImagesLimit - this.data.selectedImages.length,
  //     sizeType: 'compressed',
  //     success: res => {
  //       for (var i in res.tempFilePaths) {
  //         this.data.selectedImages.push(res.tempFilePaths[i]);
  //       }
  //       this.setData({
  //         selectedImages: this.data.selectedImages
  //       });
  //     }
  //   })
  // },

  //删除图片
  bindclearpic:function(e){
    var that = this;
    var name = 'cd.'+e.currentTarget.dataset.n;
    //console.log(name);
    that.setData({
      [name]: ''
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})