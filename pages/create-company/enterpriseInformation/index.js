var app = getApp();
var toast = require('../../../templates/showToast/showToast');
Page({
  data: {
    mainTitle: '填写企业信息',
    button_text: '下一步',
    moreAlias: true,
    cd: {}
  },
  onLoad: function(options) {
    var _this = this;
    app.Util.checkcanIUse('cover-view'); //检测组件兼容性 础库 1.4.0 开始支持

    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_info',
        data: JSON.stringify({
          union_id: wx.getStorageSync('xy_session')
        })
      },
      success: res => {
        console.log(res);
        if (res.data.sub_code == 0) {
          _this.setData({
            cd: res.data.result
          })
        } else {
          console.log('请求出错');
        }
      },
      fail: res => {
        console.log('fail');
      }
    })
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
  /**更新企业信息 */
  formSubmit: function(e) {
    var _this = this;
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
    if (company_name !== '' && company_short_name !== '' && address !== '' && floor !== '' && room !== '') {
      console.log('ok');
      //请求接口
      app.Util.network.POST({
        url: app.globalData.BASE_API_URL,
        params: {
          service: 'company',
          method: 'update',
          data: JSON.stringify({
            union_id: wx.getStorageSync('xy_session'),
            company_name: company_name,
            company_short_name: company_short_name,
            name_alias: [name_alias0, name_alias1, name_alias2],
            introduction: introduction,
            address: address,
            floor: floor,
            room: room,
            phone: phone,
            website: website
          })
        },
        success: res => {
          console.log(res);
          if (res.data.sub_code == 0) {
            wx.navigateTo({
              url: '../updateReviewInfo/index',
            })
          } else {
            console.log('请求出错');
          }
        },
        fail: res => {
          console.log('fail');
        }
      })
    } else {
      toast.showToast(this, {
        toastStyle: 'toast',
        title: '填的还不完整哦',
        duration: 1500,
        mask: false
      });
    }
  }
})