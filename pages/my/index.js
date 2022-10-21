var app = getApp()
Page( {
  data: {
    userInfo: {},
    hasUserInfo: false,
    projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
    userListInfo: [ {
      icon: '../../images/iconfont-dingdan.png',
      text: '我的订单',
      isunread: true,
    }, {
        icon: '../../images/iconfont-shouhuodizhi.png',
        text: '收货地址'
      }, {
        icon: '../../images/iconfont-help.png',
        text: '常见问题'
      }]
  },
  getStorage: function () {
    var that = this;
    wx.getStorage({
      key: 'user',
      success(res) {
        that.setData({
          touxing_img: res.data.touxing_img,
          name: res.data.name,
          hasUserInfo: true
        })
      }
    });
  },
  onLoad: function() {
    var that = this
    that.getStorage();
  },
  goDetail(e){
    if(e.currentTarget.dataset.name == '我的订单'){
      wx.navigateTo({
        url: '/pages/order-list/index'
    });
    }else if(e.currentTarget.dataset.name == '收货地址'){
      wx.navigateTo({
        url: '/pages/address/index'
    });
    }
  },
  getUserProfile(e) {
    // 不推荐使用 getUserInfo 获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        var that = this;
        wx.setStorage({
          key: 'user',
          data: {
            touxing_img: res.userInfo.avatarUrl,
            name: res.userInfo.nickName
          },
        });
        
        that.setData({
          touxing_img: res.userInfo.avatarUrl,
          name: res.userInfo.nickName,
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
})