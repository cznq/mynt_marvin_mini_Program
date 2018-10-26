var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainTitle: '填写企业信息',
    button_text: '下一步',
    moreAlias: true,
    cd:{}
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    var that = this;
    var union_id = wx.getStorageSync('xy_session');
    
    /** ===== test data ====*/
    var resdata = {
      "company_id": 1,
      "company_name": "轻客智能科技(江苏)有限公司",
      "company_short_name": "轻客",
      "name_alias": [
        "轻客智能",
        "小觅公司"
      ],
      "logo": "http://sendcard.slightech.com/logo/1520477518.jpg",
      "introduction": "轻客智能",
      "floor": 19,
      "room": "1909",
      "video_url": "http://sendcard.slightech.com/video/slightech.mp4",
      "background_url": "http://sendcard.slightech.com/video/slightech.jpg",
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


    //请求
    // app.Util.network.POST({
    //   url: app.globalData.BENIFIT_API_URL,
    //   params: {
    //     service: 'company',
    //     method: 'update_employee',
    //     data: JSON.stringify({
    //       union_id: union_id
    //     })
    //   },
    //   success: res => {
    //     var resdata = res.data.result;
    //     if (resdata) {
    //       // wx.navigateTo({
    //       //   url: '../information/index',
    //       // })
    //     }
    //   },
    //   fail: res => {
    //     console.log('fail');
    //   }
    // })
  },
  //更多公司别称
  moreAlias: function() {
    console.log(this.data.moreAlias);
    if (this.data.moreAlias == true) {
      this.setData({
        moreAlias: false
      })
    } else {
      this.setData({
        moreAlias: true
      })
    }
  },
  /**下一步 */
  formSubmit:function(e){
    var that = this;
    var company_name = e.detail.value.company_name,
      company_short_name = e.detail.value.company_short_name,
      name_alias0 = e.detail.value.name_alias0,
      name_alias1 = e.detail.value.name_alias1,
      name_alias2 = e.detail.value.name_alias2,
      address = e.detail.value.address,
      floor = e.detail.value.floor,
      room = e.detail.value.room,
      phone = e.detail.value.phone,
      website = e.detail.value.website,
      introduction = e.detail.value.introduction;

      console.log(company_name, company_short_name, name_alias0, name_alias1, name_alias2, address, floor, room, phone, website, introduction);

    if (company_name !== '' && company_short_name !== '' && address !== '' && floor !== '' && room !== ''){
      console.log('ok');
      //请求接口
      wx.navigateTo({
        url: '../data/index',
      })
    }else{
      toast.showToast(this, {
        toastStyle: 'toast',
        title: '填的还不完整哦',
        duration: 1500,
        mask: false
      });
    }
    
    
    

    
  }

})