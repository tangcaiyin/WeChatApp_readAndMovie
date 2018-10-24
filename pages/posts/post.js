// 引入mock数据
var postsData = require('../../data/posts-data.js');

Page({
    data: {
    	// 包含多个数据对象的数组
        postsDataArr: []
    },

	// 生命周期函数--监听页面加载
    onLoad: function(options) {
        // 获取自后端的数据
        // 添加到data初始数据里，需要在data里设置键值
        this.setData({
            postsDataArr: postsData.postList
        });
    },

    // 点击文章列表，跳转到相应文章详情页
    onPostTap:function(event){
    	// data-postId 转化为小写，即postid，
		var postId = event.currentTarget.dataset.postid;
		// wx.navigateTo() 方法，父页面进入子页面，传入子页面id，存在返回按钮，
		wx.navigateTo({
			url:'post-detail/post-detail?id=' + postId,
		})
    },

    // 点击轮播图文章列表，跳转到相应文章详情页
	onSwiperItemTap:function(event){
		// var postId = event.currentTarget.dataset.postid;
		// wx.navigateTo({
		// 	url:'post-detail/post-detail?id=' + postId,
		// })
	},

	// 轮播图文章列表触摸事件的事件委托写法，
	// 触摸事件的直接作用元素是image，
	// target查找的是事件直接作用的目标元素image上的dataset.postid，
	// 如果使用 currentTarget，则查找的是事件所传播到的元素swiper上的dataset.postid，
	onSwiperTap:function(event){
		var postId = event.target.dataset.postid;
		wx.navigateTo({
			url:'post-detail/post-detail?id=' + postId,
		})
	}




})