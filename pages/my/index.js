// pages/my/index.js
// const l = require('lin-ui')
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
    lock: false, //登录按钮状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    
    //是否授权，授权了就自动登录
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
              wx.showLoading({
                title: '正在自动登录',
              })
              this.getuserinfoAndset();
        }else{
          wx.removeStorage({
            key: 'userInfo',
            success: function (res) { },
          });
        }
      }
    })
  },

  //获取用户信息并存缓存
  getuserinfoAndset: function(){
    wx.getUserInfo({
      //获取用户信息时不弹窗
      withCredentials: false,
      success: (res) => {
        wx.hideLoading();
        this.setData({
          userInfo: {
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName
          },
          bType: "warn",
          actionText: "退出登录",
          lock: true
        });

        wx.setStorage({
          key: 'userInfo',
          data: {
            userInfo: {
              avatarUrl: this.data.avatarUrl,
              nickName: this.data.nickName
            },
            bType: "warn",
            actionText: "退出登录",
            lock: true
          },

        })
      }
    })
  },

  //登录或退出登录
  bindAction: function(){
    
    //如果没有登录就获取权限
    if(!this.data.lock){
      //是否授权，授权了就重新缓存用户信息
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.showLoading({
              title: '正在登录',
            })
            this.getuserinfoAndset();
            wx.login({
              success(res) {
                if (res.code) {
                  //发起网络请求
                  wx.request({
                    url: 'http://192.168.43.47:8080/login',
                    method: "GET",
                    data: {
                      code: res.code
                    },
                    success: (res) => {
                      //设置token
                      var openid = res.data;
                      wx.setStorage({
                        key: 'token',
                        data: openid,
                      })
                    }
                  })
                } else {
                  console.log('登录失败！' + res.errMsg)
                }
              }
            })
          } else {//没有授权
            console.log("auth start");
            wx.authorize({
              scope: 'scope.userInfo',
              success: () => {
                //看官方例子很重要
                console.log("auth success");
                wx.showLoading({
                  title: '正在登录',
                })
                this.getuserinfoAndset();
                //获取code，进而获取用户唯一标识openid
                
              }
            })
          }
        }
      })






      
    }else{
      console.log("已经登录");
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
            wx.removeStorageSync('token');
            this.setData({
              userInfo: {
                avatarUrl: "",
                nickName: "未登录"
              },
              bType: "primary",
              actionText: "登录",
              lock: false
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

  },

  changeTabs: function(){
    
  }
})