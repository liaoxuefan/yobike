// pages/wallet/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banlance: 0,
    deposit: "99元，押金退款"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的钱包',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getStorage({
      key: 'banlance',
      success: function(res) {
        that.setData({
          banlance: res.data.banlance
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'banlance',
      success: function (res) {
        that.setData({
          banlance: res.data.banlance
        })
      },
    })
  },

  banlanceDesc: function(){
    wx.showModal({
      title: '',
      content: '充值0.00元+活动赠送0.00元',
      showCancel: false,
      confirmText: "我知道了"
    })
  },

  //充值
  movetoRecharge: function(){
    wx.redirectTo({
      url: '../recharge/index',
    })
  },

  //押金
  showDeposit: function(){
    wx.showModal({
      title: '',
      content: '押金会立即退回，退回后将不能使用yobike确认要退款吗？',
      cancelText: "继续使用",
      cancelColor: "#b9dd08",
      confirmText: "立即退款",
      confirmColor: "#ccc",
      success: (res) => {
        if(res.confirm){
          wx.showToast({
            title: '退款成功',
            icon: "success",
            duration: 2000
          })
          this.setData({
            deposit: "未交押金"
          })
        }
      }
    })
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