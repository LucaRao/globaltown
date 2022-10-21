import {
  supabase
} from '../../lib/supabase'
import { formatTime } from '../../utils/util'
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
Page({
    data: {
        allOrderList: [],
        showType: 9,
        hasOrder: 0,
        showTips: 0,
    },
    async getOrderList() {
        let that = this;
        const order_list = await supabase
        .from('order_list').select();
        if(order_list.data.data){
          order_list.data.data.forEach(i =>{
            i.order_detail = JSON.parse(i.order_detail),
            i.created_at = formatTime(i.created_at)
          })
          that.setData({
            allOrderList: order_list.data.data
        });console.log(this.data.allOrderList)
        }
    },
    toIndexPage: function(e) {
        wx.switchTab({
            url: '/pages/index/index'
        });
    },
    onLoad: function() {},
    onShow: function() {
        this.getOrderList();
    },
})