// 引入mock数据
var postsData = require('../../../data/posts-data.js');
// 获取 app.js 里的全局变量
var app = getApp();

Page({
	data:{
		// 手动添加到 data 里的值不需要预设key吗？？？ 
		currentPostId:null,
		// 单个数据对象
		// postData:{},
		isPlayingMusic:false,
	},
	// 生命周期，页面初始化，
	onLoad:function(option){
		// 接收父页面传入的子页面id（用于获取相应子页面数据），存入data（方便其他方法使用），
		var postId = option.id;
		this.setData({
			currentPostId:postId
		})
		var postData = postsData.postList[postId];
		// 异步执行使用setData()添加数据
		this.setData({
			postData:postData
		});

		// 从缓存里同步（getStorageSync）读取文章收藏状态，异步方法 getStorage，
		var postsCollected = wx.getStorageSync('posts_collected');
		if(postsCollected){
			var postCollected = postsCollected[postId];
			if(postCollected){
				this.setData({
					collected:postCollected
				})
			}
		} else {
			// 缓存里不存在收藏状态，
			var postsCollected = {};
			postsCollected[postId] = false;
			wx.setStorageSync('posts_collected',postsCollected)
		}

		// bug：音乐播放按钮会使音乐重新从头播放，音乐播放器则只是暂停播放，该bug仅存在于模拟环境下，真机环境下不会出现该bug。

		// bug：直接关闭播放器，页面里的播放按钮不会切换，依然是播放的按钮

		// 获取全局变量里保存的音乐运行状态、播放音乐页面id，退出子页面再进入某个子页面时，音乐若依旧处于播放状态，且进入的子页面id等同于全局变量里保存的播放音乐页面id时（进入的是上次播放音乐的页面），更新页面UI（显示播放按钮、音乐背景图），若进入其他非该id的子页面，则页面UI不变，音乐不会停止。退出某个页面，该页面的音乐依然播放，不会停止。
		var bool = app.globalData.g_isPlayMusic;
		var id = app.globalData.g_currentMusicPostId;
		if(bool && id === postId){
			this.setData({
				isPlayingMusic:true
			})
		}

		// 监听音乐运行状态
		this.setMusicMonitor();

	},

	// 点击收藏
	onCollectionTap:function(event){
		this.getPostsCollectedSync();
		// this.getPostsCollected();
	},

	// 同步方法读取缓存
	getPostsCollectedSync:function(){
		// 读取缓存，获取当前文章收藏状态，取反、修改收藏状态、重新存入缓存，实现收藏状态切换，
		var postsCollected = wx.getStorageSync('posts_collected');
		var postCollected = postsCollected[this.data.currentPostId];
		postCollected = !postCollected;
		postsCollected[this.data.currentPostId] = postCollected;
		// 需要添加this调用方法
		this.showToast(postsCollected, postCollected);
		// this.showModal(postsCollected, postCollected);
	},

	// 异步方法读取缓存
	getPostsCollected:function(){
		// 读取缓存，获取当前文章收藏状态，取反、修改收藏状态、重新存入缓存，实现收藏状态切换，
		var that = this;
		wx.getStorage({
			key:'posts_collected',
			success:function(res){
				var postsCollected = res.data;
				var postCollected = postsCollected[that.data.currentPostId];
				postCollected = !postCollected;
				postsCollected[that.data.currentPostId] = postCollected;
				that.showToast(postsCollected, postCollected);
			}
		})
	},

	// 修改收藏状态，以提示窗方式确认，
	showToast:function(postsCollected, postCollected){
		wx.setStorageSync('posts_collected',postsCollected);
		this.setData({
			collected:postCollected
		})
		wx.showToast({
			title:postCollected ? '收藏成功':'取消收藏',
			duration:1000,
			icon:'success'
		});
	},

	// 修改收藏状态，以模态框方式确认，
	showModal:function(postsCollected, postCollected){
		// 处理this指代的对象
		var that = this;
		wx.showModal({
			title:'收藏',
			content: postCollected ? '收藏该文章?' : '取消收藏该文章?',
			cancelText:'取消',
			cancelColor:'#333',
			confirmText:'确认',
			confirmColor:'#405f80',
			success:function(res){
				if(res.confirm){
					wx.setStorageSync('posts_collected',postsCollected);
					that.setData({
						collected:postCollected
					})
				}
			}
		})
	},

	// 点击分享
	onShareTap:function(){
		// 小程序里分享功能API还不完善，无法使用
		// 分享窗口显示以下分享内容，
		var itemList = [
		"分享给微信好友",
		"分享到朋友圈",
		"分享到QQ",
		"分享到微博"
		];
		wx.showActionSheet({
			itemList:itemList,
			itemColor:'#405f80',
			success:function(res){
				// 用户是否点击了取消按钮，未点击时该值为undefined，
				// res.cancel;
				// 数组元素索引，
				// res.tapIndex;
				wx.showModal({
					title:'用户' + itemList[res.tapIndex],
					content:'用户是否取消？' + res.cancel
				})
			}
		})
	},

	// 点击音乐播放暂停，isPlayingMusic表示音乐运行状态。通过点击图标，实现对音乐的播放暂停，同时切换isPlayingMusic状态布尔值，该状态值配合三元表达式（注意写法）实现音乐播放暂停图标的切换，
	onMusicTap:function(event){
		var currentPostId = this.data.currentPostId;
		var isPlayingMusic = this.data.isPlayingMusic;
		if(isPlayingMusic){
			wx.pauseBackgroundAudio();
			this.setData({
				isPlayingMusic:false
			});
		} else {
			var music = postsData.postList[currentPostId].music;
			// 不可以使用本地文件，只能使用网络流媒体
			wx.playBackgroundAudio({
				dataUrl:music.url,
				title:music.title,
				coverImgUrl:music.coverImg
			});
			this.setData({
				isPlayingMusic:true
			})
		}
	},

	// 监听音乐运行状态，切换音乐播放器播放暂停功能，修改isPlayingMusic值，实现对播放、暂停图标的切换。即isPlayingMusic是播放暂停按钮与音乐播放器之间实现状态同步的桥梁。
	setMusicMonitor:function(){
		var that = this;
		// 监听音乐播放、暂停、结束，修改音乐运行状态为true/false，并将运行状态及所属页面id保存到全局变量，
		wx.onBackgroundAudioPlay(function(){
			that.setData({
				isPlayingMusic:true
			});
			// 修改全局变量，保存音乐运行状态为true，保存音乐所属页面id，
			app.globalData.g_isPlayMusic = true;
			app.globalData.g_currentMusicPostId = that.data.currentPostId;
		});
		wx.onBackgroundAudioPause(function(){
			that.setData({
				isPlayingMusic:false
			});
			// 修改全局变量，保存音乐运行状态为false，清空该音乐所属页面id，
			app.globalData.g_isPlayMusic = false;
			app.globalData.g_currentMusicPostId = null;
		});
		wx.onBackgroundAudioStop(function(){
			that.setData({
				isPlayingMusic:false
			});
			// 修改全局变量，保存音乐运行状态为false，清空该音乐所属页面id，
			app.globalData.g_isPlayMusic = false;
			app.globalData.g_currentMusicPostId = null;
		})
	}



})