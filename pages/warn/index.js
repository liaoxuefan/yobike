// pages/warn/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    y: 0,
    picUrls: [],
    inputValue: {
      num: 0,
      desc: ""
    },
    //勾选的故障类型
    checkboxValue: [],
    actionText: "拍照/相册",
    //提交按钮的背景色，未勾选类型时无颜色
    btnBgc: "",
    itemsValue:[
      {
        checked: false,
        value: "私锁私用",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "车牌缺损",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "轮胎坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "车锁坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "违规乱停",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "刹车坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "链条坏了",
        color: "#b9dd08"
      },
      {
        checked: false,
        value: "其他故障",
        color: "#b9dd08"
      },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '报障维修',
    })
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          y: res.latitude,
          x: res.longitude
        })

      },
    })
  },

  /**
   * 勾选故障类型
   */
  checkboxChange: function(e){
    
    let _values = e.detail.value;
    if(_values.length == 0){
      this.setData({
        btnBgc: ""
      })
    }else{
      this.setData({
        checkboxValue: _values,
        btnBgc: "#b9dd08"
      })
      //console.log(this.data.checkboxValue);
    }
  },
  //输入事件
  numberChange: function(e){
    this.setData({
      inputValue: {
        num: e.detail.value,
        desc: this.data.inputValue.desc
      }
    })
  },
  descChange: function (e) {
    this.setData({
      inputValue: {
        num: this.data.inputValue.num,
        desc: e.detail.value
      }
    })
  },

  //选择图片
  bindCamera: function (e) {
    var that = this;
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album','camera'],
      success: function(res) {
        //本地图片路径
        let tfps = res.tempFilePaths;
        let _picUrls = that.data.picUrls;
        for(let item of tfps){
          _picUrls.push(item);
          that.setData({
            picUrls: _picUrls,
            actionText: "+"
          })
        }
      },
    })
  },

  //删除图片
  delPic: function(e){
    //console.log(e);
    let index = e.target.dataset.index;
    let _picUrls = this.data.picUrls;
    _picUrls.splice(index,1);
    this.setData({
      picUrls: _picUrls
    })
  },

  //提交到服务器
  formSubmit: function(e){
    
    
    if(this.data.checkboxValue.length>0){
      wx.request({
        url: 'http://192.168.1.105:8080/bike/trouble',
        data: {
          picUrls: this.data.picUrls,
          inputValue: this.data.inputValue,          
          checkboxValue: this.data.checkboxValue,
          openid: wx.getStorageSync("token"),
          x: this.data.x,
          y: this.data.y
        },
        method: 'GET',
        success: function(res){
          //消息提示框
          console.log(res);
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      //对话框
      wx.showModal({
        title: '请填写故障信息',
        content: '故障类型必填',
        confirmText: '确认',
        cancelText: '取消',
        success: (res) => {
          if(res.confirm){
            //继续
          }else{
            //回退上一页
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
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