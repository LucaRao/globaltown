
const app = getApp()
import {
  supabase
} from '../../lib/supabase'
Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: { id: 1, address: '湖北省武汉市', full_region: '湖北省武汉市洪山区', name: '卢卡', mobile: '13100987654', is_default: 1 },
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00, //快递费
    orderTotalPrice: 0.00, //订单总价
    goodsCount: 0,
    postscript: '',
    payMethodItems: [{
      name: 'offline',
      value: '线下支付'
    },
    {
      name: 'online',
      value: '在线支付',
      checked: 'true'
    },
    ],
    payMethod: 1,
  },
  payChange(e) {
    let val = e.detail.value;
    if (val == 'offline') {
      this.setData({
        payMethod: 0
      })
    }
    else {
      this.setData({
        payMethod: 1
      })
    }
  },

  toSelectAddress: function () {
    wx.navigateTo({
      url: '/pages/address/index?type=1',
    });
  },
  bindinputMemo(event) {
    let postscript = event.detail.value;
    this.setData({
      postscript: postscript
    });
  },
  onLoad: function (options) {
    let addType = options.addtype;
    let orderFrom = options.orderFrom;
    if (addType != undefined) {
      this.setData({
        addType: addType
      })
    }
    if (orderFrom != undefined) {
      this.setData({
        orderFrom: orderFrom
      })
    }
  },
  onUnload: function () {
  },
  onShow: function () {
    // 页面显示
    this.getCheckoutInfo();
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getCheckoutInfo();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  getCheckoutInfo: async function () {
    let that = this;
    const { data } = await supabase
      .from('cart_list')
      .select('*').eq("isChecked", 1)
    if (data.data) {
      let goodsTotalPrice = 0, goodsCount = 0
      data.data.forEach(i => {
        goodsCount += i.number;
        goodsTotalPrice += i.retail_price * i.number
      })
      that.setData({
        checkedGoodsList: data.data,
        goodsTotalPrice: goodsTotalPrice,
        goodsCount: goodsCount,
      });
    }


  },
  // TODO 有个bug，用户没选择地址，支付无法继续进行，在切换过token的情况下
  submitOrder: function (e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: "确定提交订单？",
      async success(res) {
        if (res.confirm) {
          let order_detail = JSON.stringify({
            checkedGoodsList: that.data.checkedGoodsList,
            goodsTotalPrice: that.data.goodsTotalPrice,
            goodsCount: that.data.goodsCount,
            postscript: that.data.postscript
          })
          const { error } = await supabase.from("order_list").insert({
            order_detail: order_detail
          }, {
            returning: "minimal", // Don't return the value after inserting
          })
          const responses = [];
          for (const item of that.data.checkedGoodsList) {
            const response = await supabase
            .from('cart_list')
            .delete()
            .match({ id: item.id });
            responses.push(response);
          }
          await Promise.all(responses);
          wx.navigateTo({
            url: '/pages/order-list/index',
          });
        }
      }
    })
    wx.hideLoading()
  },
})