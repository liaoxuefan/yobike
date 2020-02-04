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
    positions: []
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
  //上传位置
  uploadLocation: function(){
    this.timer = setInterval(() => {
      wx.getLocation({
        type: 'gcj02',
        success:(res) => {
          var arr = this.data.positions;
          var obj = {
            "entity_name":"user"+wx.getStorageSync("token"),
            "loc_time":Date.parse(new Date())/1000,
            "latitude":res.latitude,
            "longitude":res.longitude,
            "coord_type_input":"gcj02"  
          }
          arr.push(obj);
          this.setData({
            positions: arr
          })
        }
      })
    }, 10000)
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
    //请求百度鹰眼
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        var arr = this.data.positions;
        var obj = {
          "entity_name": "user" + wx.getStorageSync("token"),
          "loc_time": Date.parse(new Date()) / 1000,
          "latitude": res.latitude,
          "longitude": res.longitude,
          "coord_type_input": "gcj02"
        }
        arr.push(obj);
        this.setData({
          positions: arr
        })
      }
    })
    wx.request({
      url: 'http://yingyan.baidu.com/api/v3/track/addpoints',
      method: 'POST',
      data: {
        ak: '5A4eSdK6aXXeZjhmGxKTnxXy65hnAmG4',
        service_id: 219089,
        point_list: this.data.positions
      },
      success: (res) => {
        console.log(res);
      }
    })
    wx.request({
      url: 'http://192.168.1.105:8080/ride/add',
      method: 'POST',
      data: {
        bike_id: this.data.id,//ObjectId
        user_id: wx.getStorageSync("token"),
        start_time: this.data.positions[0].loc_time,
        end_time: Date.parse(new Date()) / 1000
      },
      success: (res) => {
        console.log(res);
      }
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
        url: 'http://192.168.1.105:8080/bike/change?tp=1&id=' + this.data.id,
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