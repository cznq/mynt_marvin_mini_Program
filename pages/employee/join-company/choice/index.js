// pages/create-company/company-code/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '选择一种方式加入',
    button_text: '下一步',
    hint: '二维码与邀请码来自于企业内部人员的分享,可\n向企业员工或管理员索要'
  },
  bindcode: function () {
    wx.navigateTo({
      url: '../code/index',
    })
  },
  bindscan:function(){
    //呼起扫一扫
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
      }
    })
  }
})