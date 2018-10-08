// pages/mall-comment/mall-comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedImages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  uploadPhoto: function () {
    wx.chooseImage({
      success: function(res) {
        wx.uploadFile({
          url: '',
          filePath: '',
          name: '',
        })
      }
    })
    
  },

  removeImage: function () {
    //console.log(1);

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