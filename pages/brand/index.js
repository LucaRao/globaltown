import {
    supabase
} from '../../lib/supabase'
var app = getApp()
Page({
    data: {
        
    },
    onLoad: async function(options) {

        var that = this
        const brandList = await supabase
          .from('brand_list')
          .select().eq("type_id",options.id)
        if(brandList.data.data){
            that.setData({
                brandList: brandList.data.data
            });
        }
    }

})