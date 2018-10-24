// pages/movies/more-movie/more-movie.js
var util = require('../../../utils/utils.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigationTitle:'',
        movies:[],
        requestUrl:'',
        totalCount:0,
        isEmpty:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取父页面传入的数据
        var category = options.category;
        console.log(category);
        this.setData({
            navigationTitle:category
        });
        // 根据不同的影片分类进入相应的“更多”页面，
        var dataUrl = '';
        switch(category){
            case "正在热映":
                dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
                break;
        }
        this.data.requestUrl = dataUrl;
        util.http(dataUrl, this.processData);
    },

    // 鼠标滚动、页面上滑触发数据加载，该加载方法与页面初始化加载方法仅在请求的url方面不同，请求方法及数据处理回调函数相同，
    // 数据处理函数里需要保存当前数据条数，以备下次滚动加载时使用，
    // onScrollLower
    onReachBottom:function(event){
        var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
        util.http(nextUrl, this.processData);
        // 导航栏里显示加载提示动画，加载完成，加载提示动画消失
        wx.showNavigationBarLoading();
    },

    // onPullDownRefresh 只对 page 页面有效，对 scroll-view 组件无效，下拉 scroll-view 组件外部区域（属于 page 页面）可以触发 onPullDownRefresh 事件实现下拉加载。
    // 解决方案：改用view组件，因此上滑加载数据不能再使用 scroll-view 的bindscrolltolower="onScrollLower"事件。使用 page 页面的 onReachBottom 事件，监听页面下拉。


    // 下拉刷新执行方法，
    onPullDownRefresh:function(event){
        console.log('下拉')
        var refreshUrl = this.data.requestUrl + '?start=0&count=20';
        // 数据置空，重新加载
        this.data.movies = {};
        this.data.isEmpty = true;
        this.data.totalCount = 0;
        util.http(refreshUrl, this.processData);
        wx.showNavigationBarLoading();
    },

    onMovieTap:function(event){
        var movieId = event.currentTarget.dataset.movieid
        wx.navigateTo({
            url:'../movie-detail/movie-detail?id=' + movieId,
        })
    },

     // 参数：豆瓣数据、data初始数据的key，影片类型（正在热映、即将上映、top250）
    processData:function(moviesDouban){
        var movies = [];
        var subjects = moviesDouban.subjects;
        for(var idx in subjects){
            var subject = subjects[idx];
            var title = subject.title;
            if(title.length >= 6){
                title = title.substring(0,6) + '...';
            }
            // 处理获取自豆瓣接口的数据，
            // stars 数组内容为：[1,1,1,1,1]、[1,1,1,1,0]...
            var temp = {
                title:title,
                average:subject.rating.average,
                stars:util.convertToStarsArray(subject.rating.stars),
                coverageUrl:subject.images.large,
                movieId:subject.id
            }
            movies.push(temp);
        }
        var totalMovies = {};
        // 不为空，则合并新数据到原有数据，为空则添加新数据
        if(!this.data.isEmpty){
            console.log(this.data.movies)
            console.log(movies)
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies:totalMovies
        });
        this.data.totalCount += 20;
        // 隐藏加载提示动画
        wx.hideNavigationBarLoading();
        // 停止下拉刷新功能
        wx.stopPullDownRefresh();
    },



    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        wx.setNavigationBarTitle({
            title:this.data.navigationTitle,
            success:function(){

            }
        })

    }
})