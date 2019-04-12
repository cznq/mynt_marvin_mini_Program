// banquet/pages/reserve-success/index.js
var util = require("../../../utils/util.js");
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
        checkDate:'',
        checkTime:'',
        week:'今天',
        timeArr:['11:00','11:30','12:00','12:30','13:00','13:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00'],
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        let curTime = util.getTime();//获取当前时间
        var arr = that.data.timeArr
        let checkDate =  util.getDate();//默认选择当前日期
        let checkTime = that.data.checkTime;
        let week = that.data.week;
        if(curTime < arr[0]){
            checkTime = arr[0]
        }
        if(curTime >=arr[0] && curTime<arr[arr.length-1]){
            for (let i = 0; i < arr.length; i++) {
                if (curTime >= arr[i]) {
                    checkTime =  arr[i+1]
                }
            }
        }
        if(curTime>=arr[arr.length-1]){
            checkDate = this.getNextDay(checkDate);
            checkTime = arr[0];
            week="明天"
        }
        that.setData({
          commerce_id: options.commerce_id,
          // commerce_type: options.commerce_type
          checkDate:checkDate,
          checkTime:checkTime,
          week:week
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
    /*获取下一天日期*/
    getNextDay:function(d){
        d = new Date(d);
        d = +d + 1000 * 60 * 60 * 24;
        d = new Date(d);
        var y = d.getFullYear();
        var m = d.getMonth() + 1;
        var d = d.getDate();
        if (m < 10) {
            m = "0" + m;
        }
        if (d < 10) {
            d = "0" + d;
        }
        return y + "-" + m + "-" + d;
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
    goReserve:function(){
        wx.navigateTo({
            url: '/banquet/pages/restaurant-time/index',
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
        var that = this;
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage.data.stayDays>0) {
          that.setData({
            checkDate: currPage.data.checkDate,
            week:currPage.data.week,
            checkTime:currPage.data.checkTime
          })
        }
    },
  })