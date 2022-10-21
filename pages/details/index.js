var app = getApp()
import {
    supabase
} from '../../lib/supabase'
Page({
    data: {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1200,
    },

    onLoad: async function (options) {

        var that = this
        const goodsList = await supabase
            .from('goods_by_type_brand')
            .select().eq("id", options.id)
        if (goodsList.data.data) {
            that.setData({
                goodsPicsInfo: goodsList.data.data
            });
        }

    },
    //加入购物车
    async addToCart() {
        const cart_list = await supabase
            .from('cart_list')
            .select().eq("goods_id", this.data.goodsPicsInfo[0].id)
        if (cart_list.data.data.length>0) {
            const updateLikes = await supabase
                .from('cart_list').update({
                    number: cart_list.data.data[0].number+1
                }).eq("goods_id", this.data.goodsPicsInfo[0].id)
                if (updateLikes.data.data) {
                    wx.showToast({
                        title: '添加成功',
                    });
                  }else {
                    wx.showToast({
                        image: '/images/icon_error.png',
                        title: "添加失败",
                    });
                }
        }else{
            const { error} = await supabase.from("cart_list").insert({
                goods_id: this.data.goodsPicsInfo[0].id,
                number:1,
                list_pic_url:this.data.goodsPicsInfo[0].picurl,
                goods_name:this.data.goodsPicsInfo[0].title,
                retail_price:this.data.goodsPicsInfo[0].ourprice,
              }, {
                returning: "minimal", // Don't return the value after inserting
              })
              if (error && error.statusCode == 201) {
                wx.showToast({
                    title: '添加成功',
                });
              }else {
                wx.showToast({
                    image: '/images/icon_error.png',
                    title: "添加失败",
                });
            }
        }
    },
    openCartPage(){
        wx.switchTab({
          url: '/pages/cart/index',
        })
    },
    goIndexPage(){
        wx.switchTab({
            url: '/pages/index/index',
          }) 
    },
})
