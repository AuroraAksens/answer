// pages/wheel/index.js
let app = getApp()
const back = wx.createInnerAudioContext()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    award: 1,
    mode: 1, // 旋转模式
    awardList: [{
        title: '一等奖'
      },
      {
        title: '二等奖'
      },
      {
        title: '三等奖'
      }
    ], // 顺时针对应每个奖项
    msgList: [],
    awards: [],
    modalName: ""
  },
  onLoad: function (options) {
    var that = this
    let token = wx.getStorageSync('token')
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // wx.request({
    //   url: app.globalData.serveHost + 'award',
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     'token': token
    //   },
    //   success(res) {
    //     wx.hideLoading()
    //     if (res.data.code == "200") {
    //       that.setData({
    //         msgList: res.data.data.user_award,
    //         awards: res.data.data.award
    //       })
    //       if (res.data.data.status) {} else {
    //         that.setData({
    //           modalName: "Modal"
    //         })
    //       }
    //     } else if (res.data.code == "401") {
    //       that.Permissi("登录状态过期，请重新登录")
    //     } else {
    //       wx.showToast({
    //         title: '请重试！',
    //         image: '/image/icon/6.png',
    //         duration: 2000
    //       })
    //     }
    //   }
    // })
  },

  Permissi(e) {
    wx.setStorageSync('token', "")
    wx.showModal({
      title: '温馨提示',
      content: e,
      showCancel: false,
      success(res) {
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    })
  },

  // 用户点击开始抽奖
  wheelStart() {
    let that = this
    // 设置奖项
    that.setData({
      award: 3
    })
    // 触发组件开始方法
    that.selectComponent('#sol-wheel').begin()
    return
    let token = wx.getStorageSync('token')
    // 设置奖项
    wx.request({
      url: app.globalData.serveHost + 'user/draw',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'token': token
      },
      success(res) {
        if (res.data.code == "200") {
          // 设置奖项
          that.setData({
            award: res.data.data.number
          })
          // 触发组件开始方法
          that.selectComponent('#sol-wheel').begin()
          back.autoplay = true
          back.play()
          back.src = '/images/zp.mp3'
        } else if (res.data.code == "401") {
          wx.setStorageSync('token', "")
          that.Permissi("登录状态过期，请重新登录")
        } else if (res.data.code == "400") {
          wx.showToast({
            title: res.data.msg,
            // image: '/image/icon/6.png',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '请重试！',
            // image: '/image/icon/6.png',
            duration: 2000
          })
        }
      }
    })
  },
  // 抽奖完成后操作
  wheelSuccess() {
    back.pause()
    const index = this.data.award - 1
    console.log(this.data.awardList[index].title)
    if (this.data.awardList[index].title == "谢谢惠顾") {
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.autoplay = true
      innerAudioContext.src = '/images/whj.mp3'
      innerAudioContext.onEnded(function () {
        innerAudioContext.destroy()
      })
      wx.showToast({
        title: '很可惜没有中奖',
        icon: 'none'
      })
    } else {
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.autoplay = true
      innerAudioContext.src = '/images/hj.mp3'
      innerAudioContext.onEnded(function () {
        innerAudioContext.destroy()
      })
      wx.showToast({
        title: `恭喜你获得${this.data.awardList[index].title}`,
        icon: 'none'
      })
    }
    return

  },
  goIndex() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})