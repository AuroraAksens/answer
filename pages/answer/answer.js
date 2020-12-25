// pages/answer/answer.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //弹框 false关闭  true开启
    showTips: false,

    // 题目
    id: -1,

    problemData: [],
    problemTitle: '',
    problemID: '',

    isCorrect: null,
    prompt: '',
    next: '',
  },

  //弹框
  showTips() {
    let next = this.data.next
    this.setData({
      showTips: false
    })
    this.getProblemData(next)
  },

  //选题
  choice(e) {
    let that = this
    let token = wx.getStorageSync('token')
    let id = e.currentTarget.dataset.id //问题选项ID
    let title = e.currentTarget.dataset.title //本题ID
    let index = e.currentTarget.dataset.index
    that.setData({
      id:index
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'record',
      method: 'POST',
      data: {
        problem_item_id: id,
        problem_id: title
      },
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
          let isCorrect = res.data.data.is_correct // 判断是否对错
          let prompt = res.data.data.prompt //错误提示
          let next = res.data.data.is_next //是否有下一题
          that.setData({
            next: next,
            isCorrect: isCorrect
          })
          if (isCorrect == 1) {
            wx.showToast({
              title: '恭喜答对！',
              icon: 'none',
              duration: 1000
            })
            setTimeout(function () {
              that.getProblemData(next)
            }, 1000)
          } else {
            that.setData({
              prompt: prompt,
              showTips: true
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },



  //获取问题数据
  getProblemData(e) {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'problem',
      method: 'GET',
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        if (e == 0) {
          wx.showToast({
            title: '完成答题',
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/answerEnd/answerEnd',
            })
          }, 2000)
        } else {
          if (res.data.code == 200) {
            that.setData({
              problemData: res.data.msg.problem_item,
              problemTitle: res.data.msg.title,
              problemID: res.data.msg.problem_id,
              isCorrect: null,
              id: -1
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getProblemData()
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