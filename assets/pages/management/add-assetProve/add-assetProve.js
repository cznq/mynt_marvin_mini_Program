var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    owner_id: 0,
    buildingInfo: {},
    floor: 0,
    room: "",
    roomArea: 0,
    uploadImage: '',
    selectedImages: [],
    items: [{
        name: 'roomProve',
        value: '房产证',
        checked: 'true'
      },
      {
        name: 'leasContr',
        value: '租赁合同'
      },
    ],
    selMode: 'roomProve',
    submit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    if (JSON.stringify(options) != "{}") {
      let assetInfo = JSON.parse(options.assetInfo)
      this.setData({
        buildingInfo: assetInfo.buildingInfo,
        floor: assetInfo.floor_index,
        room: assetInfo.room,
        roomArea: assetInfo.roomArea,
        owner_id: 1, //assetInfo.owner_id
        employee_id: 1 //assetInfo.employee_id
      })
    }
  },
  radioChange(e) {
    this.setData({
      selMode: e.detail.value
    })
  },
  currentState(e) {
    if (e.detail.uploadState) {
      let certificate_url_list = []
      if (typeof(e.detail.sucUplodImg) === "string") {
        certificate_url_list = [e.detail.sucUplodImg]
      } else {
        certificate_url_list = e.detail.sucUplodImg
      }
      this.setData({
        submit: true,
        sucUplodImg: certificate_url_list
      })
    } else {
      this.setData({
        submit: false
      })
    }
  },
  submit() {
    let that = this;
    app.Util.networkUrl.postUrl({
      url: app.globalData.BASE_ASSET_URL + '/asset/create',
      params: {
        data: JSON.stringify({
          owner_id: parseInt(that.data.owner_id),
          building_id: parseInt(that.data.buildingInfo.id), //员工身份请求时，传此值
          room_number: that.data.room,
          area: parseInt(that.data.roomArea),
          floor_index: parseInt(that.data.floor),
          certificate_url_list: that.data.sucUplodImg,
          // employee_id: parseInt(that.data.employee_id)
        })
      },
      success: res => {
        console.log('res::', res);
        if (res.data.sub_code === "SUCCESS") {
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.sub_msg,
            icon: 'none',
            duration: 2000
          })
        }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})