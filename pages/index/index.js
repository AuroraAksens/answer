//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //弹框 false关闭  true开启
    showTips: false,
    showTips2: false,

    selShow: false,

    selectBox: -1,

    showdata: [],

    index: '',

    listData: null,

    dep: '',
    name: '',
    chlogin: '',
    chlogin1: '',


  },
  onLoad: function () {

  },

  //弹框
  showTips() {
    let show = this.data.showTips
    if (show == true) {
      this.setData({
        showTips: false
      })
    } else {
      this.setData({
        showTips: true
      })
    }
  },

  //弹框2
  showTips2() {
    let that = this
    let show = this.data.showTips2
    if (show == true) {
      wx.showModal({
        title: '填写确认',
        content: '填写确认资料确认无误',
        success(res) {
          if (res.confirm) {
            that.postUserData()
          } else if (res.cancel) {
            that.setData({
              showTips2: false
            })
          }
        }
      })
    } else {
      this.setData({
        showTips2: true
      })
    }
  },

  //跳转个人信息
  goMy() {
    wx.navigateTo({
      url: '/pages/my/my',
    })
  },

  //跳转奖品信息
  goPrize() {
    wx.navigateTo({
      url: '/pages/prize/prize',
    })
  },

  // 下拉菜单
  bindPickerChange: function (e) {
    let index = e.detail.value
    this.setData({
      departmentID: this.data.showdata[index].department_id,
      index: index
    })
  },

  //个人姓名
  getName(e) {
    let name = e.detail.value
    this.setData({
      name: name
    })
  },

  //部门
  getDepartment(e) {
    let dep = e.detail.value
    this.setData({
      dep: dep
    })
  },

  // 获取授权
  getUserInfoFun(e) {
    let that = this
    let userInfo = e.detail.userInfo
    that.setData({
      userInfo:userInfo
    })
    that.cxlo()
  },

  // 重新登录
  cxlo() {
    let that = this
    let userInfo = that.data.userInfo
    let chlogin = that.data.chlogin
    wx.login({
      success(res) {
        if (res.code && userInfo) {
          let code = res.code
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.src + 'login', //仅为示例，并非真实的接口地址
            method: 'POST',
            data: {
              code: code,
              avatarUrl: userInfo.avatarUrl,
              nickName: userInfo.nickName
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              wx.hideLoading()
              that.getListData()
              wx.setStorageSync('token', res.data.data.token)
              if (res.data.code == 200) {
                // that.getDepartmentData()
                if (chlogin == 0) {
                  that.showTips2()
                } else {
                  wx.navigateTo({
                    url: '/pages/answer/answer',
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

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  goend() {
    wx.navigateTo({
      url: '/pages/answerEnd/answerEnd',
    })
  },



  //获取首页数据
  getListData() {
    let that = this;
    let token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    console.log(token)
    if (token) {
      wx.request({
        url: app.globalData.src + 'index',
        method: 'GET',
        header: {
          'token': token,
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              // listData: res.data.data,
              chlogin: res.data.data.is_write,
              chlogin1: res.data.data.is_play
            })
            wx.setStorageSync('chlogin', res.data.data.is_write)
          } else if (res.data.code == 10004) {
            console.log(10004)
            wx.getStorageSync('token', '')
            that.cxlo()
          } else if (res.data.code == 10003) {
            console.log(10003)
            wx.getStorageSync('token', '')
            that.cxlo()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
      })
    } else {
      wx.request({
        url: app.globalData.src + 'index',
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              // listData: res.data.data,
              chlogin: res.data.data.is_write,
              chlogin1: res.data.data.is_play
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        },
      })
    }

  },


  //获取部门列表数据
  // getDepartmentData() {
  //   let that = this;
  //   let token = wx.getStorageSync('token')
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   wx.request({
  //     url: app.globalData.src + 'department',
  //     method: 'GET',

  //     header: {
  //       'token': token,
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success(res) {
  //       wx.hideLoading()
  //       if (res.data.code == 200) {
  //         that.setData({
  //           showdata: res.data.data
  //         })
  //       } else {
  //         wx.showToast({
  //           title: res.data.msg,
  //           icon: 'none',
  //           duration: 2000
  //         })
  //       }
  //     },
  //   })
  // },


  //提交个人数据
  postUserData() {
    let that = this;
    let token = wx.getStorageSync('token')
    let name = that.data.name
    let dep = that.data.dep
    let chlogin = that.data.chlogin
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.src + 'information',
      method: 'POST',
      data: {
        name: name,
        department_name: dep
      },
      header: {
        'token': token,
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.getListData()
        wx.hideLoading()
        if (res.data.code === 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            showTips2: false
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '/pages/answer/answer',
            })
          }, 2000)
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

  guanbi() {
    this.setData({
      showTips2: false
    })
  },


  onShow: function () {
    this.getListData()
  },

})