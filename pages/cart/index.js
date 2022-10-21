import {
  supabase
} from '../../lib/supabase'
const app = getApp()

Page({
  data: {
    cartGoods: [],
    cartTotal: {
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00,
    },
    checkedAllStatus: true,
    isTouchMove: false,
    startX: 0, //开始坐标
    startY: 0,
    hasCartGoods: 0
  },
  onLoad: function () {
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getCartList();
    this.getCartNum();
  },
  goGoodsDetail(e) {
    let goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '/pages/details/index?id=' + goodsId,
    })
  },
  nothing: function () {

  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getCartList();
    this.getCartNum();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  toIndexPage: function () {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  getCartList: async function () {
    let that = this;
    const { data, error } = await supabase
      .from('cart_list')
      .select('*')
    if (data.data) {
      let hasCartGoods = data.data;
      if (hasCartGoods.length != 0) {
        hasCartGoods = 1;
      } else {
        hasCartGoods = 0;
      }
      let cartTotal = { checkedGoodsCount: 0, checkedGoodsAmount: 0.00 }
      // if(that.data.checkedAllStatus){
        data.data.forEach(i => {
          if(i.isChecked){
            cartTotal.checkedGoodsCount += i.number;
            cartTotal.checkedGoodsAmount += i.retail_price * i.number
          }
        })
      // }
      that.setData({
        cartGoods: data.data,
        cartTotal: cartTotal,
        hasCartGoods: hasCartGoods
      });
    }
    that.setData({
      checkedAllStatus: that.isCheckedAll()
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.isChecked == true) {
        return true;
      } else {
        return false;
      }
    });
  },

  checkedAll: async function () {
    let that = this;
      if (that.data.checkedAllStatus) {
        const { error } = await supabase
          .from('cart_list').update({
            isChecked: 0
          }).eq("isChecked",1)
          let cartTotal = { checkedGoodsCount: 0, checkedGoodsAmount: 0.00 }
        that.setData({
          checkedAllStatus: 0,
          cartTotal: cartTotal
        });
      } else {
        const { data, error } = await supabase
          .from('cart_list')
          .select('*')
         let cart_list_data= await supabase
          .from('cart_list').update({
            isChecked: 1
          }).eq("isChecked",0)
        if (data.data) {
          let cartTotal = { checkedGoodsCount: 0, checkedGoodsAmount: 0 }
          data.data.forEach(i => {
            cartTotal.checkedGoodsCount += i.number;
            cartTotal.checkedGoodsAmount += i.retail_price * i.number
          })
          that.setData({
            cartGoods: data.data,
            cartTotal: cartTotal
          });
          that.setData({
            checkedAllStatus: 1
          });
        }
      }
      that.getCartList();
      that.getCartNum();

  },
  updateCart: async function (itemIndex, number, id) {
    let that = this;
    wx.showLoading({
      title: '',
      mask: true
    })
    const { error } = await supabase
      .from('cart_list').update({
        number: number
      }).eq("id", id);
    const { data } = await supabase
      .from('cart_list')
      .select('*').eq("isChecked",1)
    if (data.data) {
      let cartTotal = { checkedGoodsCount: 0, checkedGoodsAmount: 0 }
      data.data.forEach(i => {
          cartTotal.checkedGoodsCount += i.number;
          cartTotal.checkedGoodsAmount += i.retail_price * i.number
      })
      that.setData({
        cartGoods: data.data,
        cartTotal: cartTotal
      });
      // let cartItem = that.data.cartGoods[itemIndex];
      // cartItem.number = number;
      that.getCartNum();
    } else {
      wx.showToast({
        icon: 'none',
        title: '库存不足了'
      })
    }
    that.setData({
      checkedAllStatus: that.isCheckedAll()
    });
    wx.hideLoading({
    })

  },
  cutNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    if (cartItem.number - 1 == 0) {
      wx.showToast({
        icon: 'none',
        title: '删除左滑试试'
      })
    }
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
    this.setData({
      cartGoods: this.data.cartGoods,
    });
    this.updateCart(itemIndex, number, cartItem.id);
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = Number(cartItem.number) + 1;
    this.setData({
      cartGoods: this.data.cartGoods,
    });
    this.updateCart(itemIndex, number, cartItem.id);
  },
  getCartNum: async function () {
    const { data } = await supabase
      .from('cart_list')
      .select('*')
    if (data.data.length > 0) {
      let num = 0
      data.data.forEach(i => {
        num += i.number
      })
      let cartGoodsCount = '';
      if (num == 0) {
        wx.removeTabBarBadge({
          index: 2,
        })
      } else {
        cartGoodsCount = num + '';
        wx.setTabBarBadge({
          index: 2,
          text: cartGoodsCount
        })
      }
    }
  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;
    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.isChecked == true) {
        return true;
      } else {
        return false;
      }
    });
    if (checkedGoods.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: '你好像没选中商品'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/order-check/index?addtype=0'
    })
  },

  checkedItem: async function (e) {
    let itemIndex = e.currentTarget.dataset.itemIndex;
    let that = this;

      const { data } = await supabase
        .from('cart_list')
        .select('*').eq("goods_id", that.data.cartGoods[itemIndex].goods_id)
      if (data.data.length > 0) {
        const cheked = await supabase
          .from('cart_list').update({
            isChecked: that.data.cartGoods[itemIndex].isChecked ? 0 : 1,
          }).eq("goods_id", that.data.cartGoods[itemIndex].goods_id);
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      }
      that.getCartList();
      that.getCartNum();
  },
  handleTap: function (event) { //阻止冒泡 

  },
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.cartGoods.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cartGoods: this.data.cartGoods
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.cartGoods.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      cartGoods: that.data.cartGoods
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  deleteGoods: async function (e) {
    //获取已选择的商品
    let itemIndex = e.currentTarget.dataset.itemIndex;
    let that = this;
    const { data, error } = await supabase
      .from('cart_list')
      .delete()
      .match({ goods_id: this.data.cartGoods[itemIndex].goods_id })
    if (data.data) {
      that.getCartList();
      that.getCartNum();
    }
    that.setData({
      checkedAllStatus: that.isCheckedAll()
    });

  }
})