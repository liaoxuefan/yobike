// pages/record/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: wx.getSystemInfoSync().windowHeight,
    latitude: 0,
    longitude: 0,

    markers: [],
    polyline: [],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '行程轨迹',
    })

    var that = this;
    wx.request({
      url: 'http://yingyan.baidu.com/api/v3/track/gettrack',
      data: {
        ak:'5A4eSdK6aXXeZjhmGxKTnxXy65hnAmG4',
        service_id: 219089,
        entity_name: 'bike',
        start_time: options.start_time,
        end_time: options.end_time,
        is_processed: 1,
        process_option: 'need_denoise=1,need_vacuate=1,need_mapmatch=1,transport_mode=riding',
        coord_type_output: "gcj02"
      },
      method: "GET",
      success: function (res) {
        console.log(res);
        that.setData({
          
          polyline: [{
            points: res.data.points,
            color: "#FF0000DD",
            width: 4,
            dottedLine: true
          }],
          markers: [
            {
              iconPath: '/images/route_start.png',
              id: 0,
              latitude: res.data.start_point.latitude,
              longitude: res.data.start_point.longitude,
              width: 30,
              height: 30,
            },
            {
              iconPath: '/images/route_end.png',
              id: 1,
              latitude: res.data.end_point.latitude,
              longitude: res.data.end_point.longitude,
              width: 35,
              height: 35,
            }
          ],
          latitude: res.data.points[0].latitude,
          longitude: res.data.points[0].longitude,
        })
      }
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