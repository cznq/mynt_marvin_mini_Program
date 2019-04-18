Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },
  /**
 * 组件的初始数据
 */
  data: {
    timeArr: [
      { id: 0, time_slot: "00:00 — 01:00" },
      { id: 1, time_slot: "01:00 — 02:00" },
      { id: 2, time_slot: "02:00 — 03:00" },
      { id: 3, time_slot: "03:00 — 04:00" },
      { id: 4, time_slot: "04:00 — 05:00" },
      { id: 5, time_slot: "05:00 — 06:00" },
      { id: 6, time_slot: "06:00 — 07:00" },
      { id: 7, time_slot: "07:00 — 08:00" },
      { id: 8, time_slot: "08:00 — 09:00" },
      { id: 9, time_slot: "09:00 — 10:00" },
      { id: 10, time_slot: "10:00 — 11:00" },
      { id: 11, time_slot: "11:00 — 12:00" },
      { id: 12, time_slot: "12:00 — 13:00" },
      { id: 13, time_slot: "13:00 — 14:00" },
      { id: 14, time_slot: "14:00 — 15:00" },
      { id: 15, time_slot: "15:00 — 16:00" },
      { id: 16, time_slot: "16:00 — 17:00" },
      { id: 17, time_slot: "17:00 — 18:00" },
      { id: 18, time_slot: "18:00 — 19:00" },
      { id: 19, time_slot: "19:00 — 20:00" },
      { id: 20, time_slot: "20:00 — 21:00" },
      { id: 21, time_slot: "21:00 — 22:00" },
      { id: 22, time_slot: "22:00 — 23:00" },
      { id: 23, time_slot: "23:00 — 24:00" },
      { id: 24, time_slot: "次日00:00 — 01:00" },
      { id: 25, time_slot: "次日01:00 — 02:00" },
      { id: 26, time_slot: "次日02:00 — 03:00" },
      { id: 27, time_slot: "次日03:00 — 04:00" },
      { id: 28, time_slot: "次日04:00 — 05:00" },
      { id: 29, time_slot: "次日05:00 — 06:00" },
      { id: 30, time_slot: "次日06:00 — 07:00" },
    ],
    show: false,
    value:[0],//默认当前显示在第几个时间段
  },
   /**
   * 组件的方法列表
   */
  ready: function() {
    wx.setStorageSync('timeOri', this.data.timeArr);
  },
  methods: {
    //初始化选择器信息
    toggleSelect: function () {
      let show = this.data.show
      if (show) return this.setData({ show: !show })
      let hour = parseInt(new Date().getHours());    //返回小时数
      let timeArr = wx.getStorageSync("timeOri");
      timeArr.splice(0,hour)
      this.setData({
        show: !show,
        value:[0],//根据当前时间，默认选中最近的时间段 截断后默认都是第一个
        timeArr:timeArr
      });
    },
    changeTimePicker: function (e) {
      const val = e.detail.value
      this.setData({
        value: val,
        time_slot: this.data.timeArr[val].time_slot
      });
    },
    //关闭弹窗
    // 取消
    hideTime() {
      this.setData({ show: false });
    },
    //确定
    submit: function () {
      let n = this.data.value
      this.setData({
        show: false,
        time_slot: this.data.timeArr[n].time_slot,
        time_id:this.data.timeArr[n].id
      },
      ()=>{       
        const result=[this.data.time_slot,this.data.time_id]
        this.triggerEvent('select', result)
      }
      );
    }
  }
})