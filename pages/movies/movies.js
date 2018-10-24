
// 获取公共方法
var util = require('../../utils/utils.js');
// 获取全局变量
var app = getApp();

Page({

    // 页面的初始数据
    data: {
        inTheaters:{},
        comingSoon:{},
        top250:{},
        containerShow:true,
        searchPanelShow:false,
        searchResult:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取前三条数据
        // 正在热映
        var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
        // 即将上映
        var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
        // top250
        var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';

        // 调用方法获取豆瓣数据，传入不同参数：url、该类数据在data初始数据里对应的key、影片类型，
        this.getMovieListData(inTheatersUrl, "inTheaters", '正在热映');
        this.getMovieListData(comingSoonUrl, "comingSoon", '即将上映');
        this.getMovieListData(top250Url, "top250", '豆瓣Top250');
    },

    // 聚焦 input 时触发该方法
    onBindFocus:function(){
        // 修改布尔值，隐藏初始页面，显示搜索页面
        this.setData({
            containerShow:false,
            searchPanelShow:true
        })
    },

    // 点击搜索框右边的叉号触发该方法
    onCancelImgTap:function(){
        // 修改布尔值，隐藏搜索页面，显示初始页面，清空搜索结果
        this.setData({
            containerShow:true,
            searchPanelShow:false,
            searchResult:{}
        })  
    },

    // 触发关键词搜索功能
    onBindChange:function(event){
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
        this.getMovieListData(searchUrl, 'searchResult', '');
    },

    // 调用豆瓣API，参数：请求地址、data初始数据的key，影片类型（正在热映、即将上映、top250）
    getMovieListData:function(url, settedKey, categoryTitle){
        var that = this;
        wx.request({
            url:url,
            // 提交的数据
            // data: {},
            method: 'GET',
            header:{
                // application/json、空字符串都会报错，换任意其他内容都可以，
                'Content-Type':'json'
            },
            success: function(res) {
                console.log(res.data.subjects);
                that.processData(res.data, settedKey, categoryTitle);
            }
        })
    },



    // 处理返回的数据，参数：豆瓣数据、data初始数据的key，影片类型（正在热映、即将上映、top250）
    processData:function(moviesDouban, settedKey, categoryTitle){
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

        // 多个方法的结果绑定到data里，再分类绑定到DOM里，
        // processData() 是在 wx.request() 的回调函数里调用的，不需要处理为 that，
        var readyData = {};
        readyData[settedKey] = {
            categoryTitle:categoryTitle,
            movies:movies
        };
        this.setData(readyData);
    },


    onMoreTap:function(event){
        // 获取该事件所在DOM元素上的自定义数据
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url:'more-movie/more-movie?category=' + category,
        })
    },

    onMovieTap:function(event){
        var movieId = event.currentTarget.dataset.movieid
        wx.navigateTo({
            url:'movie-detail/movie-detail?id=' + movieId,
        })

    }




})