const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Length: 6,    
    isFocus: true,   
    inputValue: "",
    errorData: null,
    empInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.showInfo('#inputRow', '请输入您录入人脸时填写的身份证后六位。');
    
    if (!(app.checkSession())) {
      app.checkLogin().then(function (res) {
        that.getEmployeeInfo();
      })
    } else {
      that.getEmployeeInfo();
    }
  },

  /**
   * 错误提示
   */
  showInfo: function (id, txt) {
    var _this = this;
    const query = wx.createSelectorQuery()
    query.select(id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      _this.setData({
        errorData: {
          top: res[0].bottom + 10,
          text: txt,
          bgcolor: '#f2f3f6',
          txtcolor: 'rgba(136, 145, 169, 1)'
        }
      })
    })
  },

  /** 监听输入事件 */
  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      inputValue: inputValue,
    })
    if (inputValue.length == that.data.Length) {
      console.log(inputValue.length);
      that.checkIdentity(inputValue);
    }
  },

  checkIdentity(idnum) {
    var id_number = this.data.empInfo.id_number;
    var id_number_last_six = id_number.substr(id_number.length - this.data.Length, this.data.Length);
    if (id_number == "") {
      wx.showToast({
        icon: 'none',
        title: '您还没录入身份信息'
      })
      return false;
    }
    if (idnum == id_number_last_six) {
      wx.redirectTo({
        url: '/pages/collect-info/identity/index',
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '输入身份信息错误'
      })
    }
  },

  /** 点击输入框 */
  Tap() {
    this.setData({
      isFocus: true
    })
  }, 

  /**
   * 获取员工信息
   */
  getEmployeeInfo: function () {
    var that = this;
    var unionId = wx.getStorageSync('xy_session');
    app.Util.network.POST({
      url: app.globalData.BASE_API_URL,
      params: {
        service: 'company',
        method: 'get_employee_info',
        data: JSON.stringify({
          union_id: unionId,
        })
      },
      success: res => {
        console.log(res);
        if(res.data.result) {
          that.setData({
            empInfo: res.data.result
          });
        }
      }
    })
  }

})