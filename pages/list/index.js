var app = getApp()
import {
    supabase
} from '../../lib/supabase'
Page({
    data: {
        
    },
    onLoad: async function(options) {
        var that = this
        const goodsList = await supabase
          .from('goods_by_type_brand')
          .select().eq("brand_id",options.brand)
          if(goodsList.data.data){
            that.setData({
                list: goodsList.data.data
            });
          }
    }

})