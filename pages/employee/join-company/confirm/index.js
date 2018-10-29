// pages/create-company/company-code/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '确认加入此公司',
    button_text: '下一步',
    hint: '二维码与邀请码来自于企业内部人员的分享,可\n向企业员工或管理员索要'
  },
  next: function () {
    wx.navigateTo({
      url: '../name/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var company_verify_code = options.company_verify_code;
    console.log(company_verify_code);
  }
})