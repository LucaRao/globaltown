//获取应用实例
import {
    supabase
} from '../../lib/supabase'
var app = getApp()
Page({
    data: {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        loadingHidden: false // loading
    },

    //事件处理函数
    swiperchange: function (e) {
        //console.log(e.detail.current)
    },

    onLoad: async function () {
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })

        //venuesList
        const type_list = await supabase
          .from('type_list')
          .select().eq("if_choice",1)
          if(type_list.data.data){
            that.setData({
                venuesItems: type_list.data.data
            })
            setTimeout(function () {
                that.setData({
                    loadingHidden: true
                })
            }, 1500)
          }
        //choiceList
        const choice_list = await supabase
          .from('goods_by_type_brand')
          .select().eq("boutique",1)
          if(choice_list.data.data){
            that.setData({
                choiceItems: choice_list.data.data
            })
            setTimeout(function () {
                that.setData({
                    loadingHidden: true
                })
            }, 1500)
          }
          const swiper_list = await supabase
          .from('goods_by_type_brand')
          .select().eq("swiper",1)
          if(swiper_list.data.data){
            that.setData({
                swiperItems: swiper_list.data.data
            })
            setTimeout(function () {
                that.setData({
                    loadingHidden: true
                })
            }, 1500)
          }

    }
})