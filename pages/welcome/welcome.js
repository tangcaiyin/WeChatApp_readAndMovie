Page({
    data: {

    },

    onTap: function() {
        // 该方法仅用于进入带tab选项卡的页面
        wx.switchTab({
            url:'../posts/post'
        });

        // 不需要“.wxml”后缀
        // 父页面跳转到子页面,会触发 onHide 生命周期，表示当前页面隐藏，因此会出现返回按钮实现返回功能
        // wx.navigateTo({
        //  url:'../posts/post',
        //  success:function(){
        //  },
        //  fail:function(){
        //  },
        //  complete:function(){
        //  }
        // });

        // 平行层级页面之间的跳转
        // 会触发 onUnload 生命周期，表示当前页面关闭，
        // wx.redirectTo({
        //  url:'../posts/post',
        //  success:function(){
        //  },
        //  fail:function(){
        //  },
        //  complete:function(){
        //  }
        // })


    },
   
})