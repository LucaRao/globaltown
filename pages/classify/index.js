    import {
    supabase
} from '../../lib/supabase'
var app = getApp()
Page({
    data: {
        navLeftItems: [],
        navRightItems: [],
        curNav: 1,
        curIndex: 0
    },
    onLoad: async function () {

        var that = this
        const typebrandList = await supabase
            .from('type_list')
            .select()
        if (typebrandList.data.data) {
            const typebrandTree = await supabase
                .from('brand_list')
                .select().eq("type_id", typebrandList.data.data[0].id)
            that.setData({
                navLeftItems: typebrandList.data.data,
                navRightItems: typebrandTree.data.data
            })
        }

    },

    //事件处理函数
    switchRightTab: async function (e) {
        let that = this
        let id = e.target.dataset.id,
            index = parseInt(e.target.dataset.index);
        const typebrandTree = await supabase
            .from('brand_list')
            .select().eq("type_id", id)
        if (typebrandTree.data.data) {
            that.setData({
                navRightItems: typebrandTree.data.data,
                curIndex: index,
                curNav: id,
            })
        }
    }

})