// banquet/pages/reserve-success/index.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        num:1,
        isChecked:false,
        sex:[
            { name: '先生', checked: true},
            { name: '女士', checked: false}
        ],
        max:'100',
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
          commerce_id: options.commerce_id,
          // commerce_type: options.commerce_type
        })
        that.getDetailInfo(that.data.commerce_id);
    },
   /**
   * 获取商家详情
   */
    getDetailInfo(commerce_id) {
        var that = this;
        app.Util.network.POST({
        url: app.globalData.BENIFIT_API_URL,
        params: {
            service: 'commerce',
            method: 'get_commerce_info',
            union_id: wx.getStorageSync('xy_session'),
            data: JSON.stringify({
            commerce_id: commerce_id
            })
        },
        success: res => {
            if (res.data.result) {
            if (res.data.result.details) {
                wx.setNavigationBarTitle({
                title: res.data.result.name
                })
            }
            }
        }
        })
    },
    /* 点击减号 */
    bindMinus: function() {
        var num = this.data.num;
        // 如果大于1时，才可以减
        if (num > 1) {
        num --;
        }
        this.setData({
        num: num
        });
    },
    /* 点击加号 */
    bindPlus: function() {
        var num = this.data.num;
        num ++;
        this.setData({
        num: num
        });
    },
    /* 输入框事件 */
    bindManual: function(e) {
        var num = parseInt(e.detail.value);
        this.setData({
        num: num
        });
    },
    changeSwitch:function(){
        if (!this.data.isChecked) {
            this.setData({
                isChecked: true,
            });
        } else {
            this.setData({
                isChecked: false,
            });
        }
    },
    remarksText:function (e) {
        var value = e.detail.value;
        // 获取输入框内容的长度
        var len = parseInt(value.length);
        //最多字数限制
        if(len > this.data.max) return;
        this.setData({
        currentWordNumber: len //当前字数  
        })
    },
    changeSex:function(e){
        console.log(e.detail.value)
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
  })