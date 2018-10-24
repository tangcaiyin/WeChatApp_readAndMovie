App({
	// 用于保存全局变量
	globalData:{
		// 音乐是否正在播放，哪一个页面的音乐在播放
		g_isPlayMusic:false,
		g_currentMusicPostId:null,
		// 豆瓣地址
		doubanBase:'https://douban.uieee.com'
		// doubanBase:'http://t.yushu.im'
	},

    // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    onLaunch: function() {
        
    },

    // 当小程序启动，或从后台进入前台显示，会触发 onShow
    onShow: function(options) {
        
    },

    // 当小程序从前台进入后台，会触发 onHide
    onHide: function() {

    },

    // 当小程序发生脚本错误，或者调用api失败时，会触发 onError 并带上错误信息
    onError: function(msg) {

    }
})