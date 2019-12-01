// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: "未登录"
    },
    bType: "primary",
    actionText: "登录",
    lock: false //登录按钮状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    //获取本地数据
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        wx.hideLoading();
        that.setData({
          userInfo: {
            avatarUrl: res.data.userInfo.avatarUrl,
            nickName: res.data.userInfo.nickName
          },
          bType: res.data.bType,
          actionText: res.data.actionText,
          lock: true
        })
      },
    })
  },

  //登录或退出登录
  bindAction: function(){
    this.data.lock = !this.data.lock;
    //如果没有登录
    if(this.data.lock){
      wx.showLoading({
        title: '正在登录',
      })
      //得到用户信息并存入缓存
      wx.login({
        success: (res) => {
          wx.hideLoading();
          wx.getUserInfo({
            //获取用户信息时不弹窗
            withCredentials: false,
            success: (res) => {
              this.setData({
                userInfo: {
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName
                },
                bType: "warn",
                actionText: "退出登录"
              });
              console.log(res);
              wx.setStorage({
                key: 'userInfo',
                data: {
                  userInfo: {
                    avatarUrl: this.data.avatarUrl,
                    nickName: this.data.nickName
                  },
                  bType: "warn",
                  actionText: "退出登录"
                },
                success: function(res){
                  console.log("存储成功");
                }
              })
            }
          })
        }
      })
    }else{
      wx.showModal({
        title: '确认退出？',
        content: '退出后将不能使用单车',
        success: (res) => {
          if(res.confirm){
            //移除缓存
            wx.removeStorage({
              key: 'userInfo',
              success: function(res) {},
            });
            this.setData({
              userInfo: {
                avatarUrl: "",
                nickName: "未登录"
              },
              bType: "primary",
              actionText: "登录"
            })
          }else{
            this.setData({
              lock: true
            })
          }
        }
      })
    }
  },

  //钱包
  movetoWallet: function(){
    wx.navigateTo({
      url: '../wallet/index',
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