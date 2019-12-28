//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    scale: 18,
    latitude: 0,
    longitude: 0,
    markers: [],
    _markers: []
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (options) {
    //页面初始化，options为页面跳转所带来的参数
    //获取定时器，用于判断是否在计费
    this.timer = options.timer;
    //获取并设置当前位置
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        
      },
    })

    var that = this;
    //3.设置地图控件的位置及大小
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          controls:[{
            id: 1,
            iconPath: '/images/use.png',
            position: {
              left: res.windowWidth/2 - 67,
              top: res.windowHeight - 80,
              width: 134,
              height: 50
            },
            clickable: true
          },
          {
            id: 2,
            iconPath: '/images/location.png',
            position: {
              left: 3 * res.windowWidth / 4 + 67 / 2 - 15,
              top: res.windowHeight - 120,
              width: 30,
              height: 30
            },
            clickable: true
          },
          {
            id: 3,
            iconPath: '/images/broken.png',
            position: {
              left: 3 * res.windowWidth / 4 + 67 / 2 - 10,
              top: res.windowHeight - 64,
              width: 20,
              height: 20
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/center_icon.png',
            position: {
              left: res.windowWidth/2 - 23/2,
              top: res.windowHeight/2 - 44.5,
              width: 23,
              height: 44.5
            },
            clickable: true
          }]
        });
      }
    })

    //4.请求服务器，显示附近的单车，用marker标记
    wx.request({
      url: 'http://192.168.1.103:8080/bike/showNear',
      data: {
        x: this.data.longitude, 
        y: this.data.latitude
      },
      method: 'GET',
      success: (res) => {
        console.log(res)
        var bikes = res.data.map((bike) => {
          return {
            longitude: bike.location[0],
            latitude: bike.location[1],
            id: bike.id.timestamp,
            iconPath: '/images/markers.png',
            width: 30,
            height: 30
          }
        })       
        this.setData({
          markers: bikes
        })
      }
    })
  },
  //地图标记点击事件
  bindmarkertap: function(e){
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let currMaker = _markers[markerId];
    this.setData({
      polyline: [{
        points: [{
          longitude: this.data.longitude,
          latitude: this.data.latitude
        },
        {
          longitude: currMaker.longitude,
          latitude: currMaker.latitude
        }],
        color: "#3883FA",
        width: 1,
        dottedLine: true
      }],
      scale: 18
    })
  },

  //拖动地图事件
  bindregionchange: function(e){
    //拖动地图，获取附近单车位置
    if(e.type == "begin"){
      
    }else if(e.type == "end"){
      this.mapCtx.getCenterLocation({
        success: (res) => {
          wx.request({
            url: 'http://192.168.1.103:8080/bike/showNear',
            method: 'GET',
            data: {
              x: res.longitude, 
              y: res.latitude
            },
            success: (res) => {
              var bikes = res.data.map((bike) => {
                return {
                  longitude: bike.location[0],
                  latitude: bike.location[1],
                  id: bike.id.timestamp,
                  iconPath: '/images/markers.png',
                  width: 30,
                  height: 30
                }
              })
              this.setData({
                markers: bikes
              })
            }
          })
        }
      })
      
    }
  },

  bindcontroltap: function(e){
    switch(e.controlId){
      case 2:this.movetoPosition();
      break;
      case 1: if(this.timer === "" || this.timer === undefined){
        //没有在计费就扫码
        wx.scanCode({
          success: (res) => {
            //获取密码和车号
            wx.showLoading({
              title: '正在开锁',
              mask: true
            })
            wx.request({
              url: '',
              data: {},
              method: 'GET',
              success: function(res){
                wx.hideLoading();
                //携带密码和车号跳转到计费页
                wx.redirectTo({
                  url: '../billing/index?password=' + res.data.data.password,
                  success: function(res){
                    wx.showToast({
                      title: '开锁成功',
                      duration: 1000
                    })
                  }
                });
              }
            })
          }
        })
      }else{
        //回退上一页
        wx.navigateBack({
          delta: 1
        })
      }
      break;
      case 3: wx.navigateTo({
        url: '../warn/index',
      });
      break;
      //手动添加单车
      case 4: 
        this.mapCtx.getCenterLocation({
          success: (res) => {
            wx.request({
              url: 'http://192.168.1.103:8080/bike/add',
              method: 'POST',
              data: {
                location: [res.longitude, res.latitude]
              }
            })
            console.log("add a bike")
            wx.request({
              url: 'http://192.168.1.103:8080/bike/showNear',
              method: 'GET',
              data: {
                x: res.longitude, 
                y: res.latitude
              },
              success: (res) => {
                var bikes = res.data.map((bike) => {
                  return {
                    longitude: bike.location[0],
                    latitude: bike.location[1],
                    id: bike.id.timestamp,
                    iconPath: '/images/markers.png',
                    width: 30,
                    height: 30
                  }
                })
                this.setData({
                  markers: bikes
                })
              }
            })
          }
        })
        
        break;
    }
  },

  myMessage: function(){
    wx.navigateTo({
      url: '../my/index',
    });
  },

  onShow: function(){
    //创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("map");
    this.movetoPosition()
  },
  movetoPosition: function(){
    this.mapCtx.moveToLocation();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
