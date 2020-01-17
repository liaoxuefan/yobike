// pages/billing/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isPay: "回到地图",
    hours: 0,
    minutes: 0,
    seconds: 0,
    billing: "正在计费",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //timer: (this.timer === undefined)?"":this.timer
    this.setData({
      number: options.number,
      timer: this.timer,
      id: options.id
    })
    //直接计时
    this.gobike();
    
  },

  //去骑行
  gobike: function(){
    var that = this;
    that.setData({
      isShow: (!this.data.isShow)
    })

    let s = 0;
    let m = 0;
    let h = 0;
    this.timer = setInterval(() => {
      this.setData({
        seconds: s++
      })
      if (s == 60) {
        s = 0;
        m++;
        setTimeout(() => {
          this.setData({
            minutes: m
          });
        }, 1000)
        if (m == 60) {
          m = 0;
          h++;
          setTimeout(() => {
            this.setData({
              hours: h
            })
          }, 1000)
        }
      }
    }, 1000)
  },

  //结束骑行，清除定时器
  endRide: function(){
    clearInterval(this.timer);
    this.timer = "";
    this.setData({
      billing: "本次骑行耗时",
      disabled: true,
      isPay: "去支付"
    })
    
    
  },

  //返回地图
  moveToIndex: function(){
     
    if(this.data.isPay == "回到地图"){
      //保留计费页跳到地图，并保存计时器状态
      wx.navigateTo({
        url: '../index/index?timer=' + this.timer,
      })
    }else{
      //支付扣款
      wx.request({
        url: '',
      })
      //单车isShow改为0
      wx.request({
        url: 'http://192.168.43.47:8080/bike/change?tp=1&id=' + this.data.id,
      })
    }
      
    
  },

  myMessage: function () {
    wx.navigateTo({
      url: '../my/index',
    });
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})