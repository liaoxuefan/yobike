// pages/recharge/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from : 0,
    price: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      from: options.from
    })
  },

  bindInput: function(e){
    //replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串
    //[^abc]	查找任何不在方括号之间的字符
    this.setData({
      price: e.detail.value.replace(/[^\d]/, '')
    })
    return this.data.price;
  },

  recharge: function(e){
    wx.request({
      url: 'http://192.168.1.105:8080/user/recharge?from=' + this.data.from + '&price=' + this.data.price,
      header: {
        'content-type': 'application/json',
        'cookie': "openid=" + wx.getStorageSync("token")
      },
      success: function (res) {
        wx.showToast({
          title: res.data,
          icon: 'none',
          duration: 2000
        })
      }
    })
    wx.request({
      url: 'http://192.168.1.105:8080/user',
      header: {
        'content-type': 'application/json',
        'cookie': "openid=" + wx.getStorageSync("token")
      },
      success: (res) => {
        console.log(res);
        wx.setStorage({
          key: 'balance',
          data: res.data.balance,
        })
        if(res.data.guarantee == 99){
          wx.setStorage({
            key: 'guarantee',
            data: '99元，点击退款',
          })
        }else{
          wx.setStorage({
            key: 'guarantee',
            data: '99元，未交押金',
          })
        }
        
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