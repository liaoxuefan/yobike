// pages/wallet/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0,
    guarantee: "99元，未交押金"
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      balance: wx.getStorageSync('balance'),
      guarantee: wx.getStorageSync("guarantee")
    })
  },

  balanceDesc: function(){
    wx.showModal({
      title: '',
      content: '充值0.00元+活动赠送0.00元',
      showCancel: false,
      confirmText: "我知道了"
    })
  },

  //充值
  movetoRecharge: function(){
    wx.navigateTo({
      url: '../recharge/index?from=0',
      
    })
  },

  //押金
  showDeposit: function(){
    if(this.data.guarantee === "99元，未交押金"){
      wx.navigateTo({
        url: '../recharge/index?from=2',
      })
    }else{
      wx.showModal({
        title: '',
        content: '押金会立即退回，退回后将不能使用yobike确认要退款吗？',
        cancelText: "继续使用",
        cancelColor: "#b9dd08",
        confirmText: "立即退款",
        confirmColor: "#ccc",
        success: (res) => {
          if (res.confirm) {
            var title;
            wx.request({
              url: 'http://192.168.1.105:8080/user/refund',
              header: {
                'content-type': 'application/json',
                'cookie': "openid=" + wx.getStorageSync("token")
              },
              success: (res) => {
                title = res.data;
                
                wx.showToast({
                  title: title,
                  icon: "none",
                  duration: 2000
                })
                if (title === "退款成功") {
                  this.setData({
                    guarantee: "99元，未交押金"
                  })
                  wx.setStorageSync('guarantee', "99元，未交押金");
                }
              }
            })
            
            

          }
        }
      })
    }
    
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