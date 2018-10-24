
// var util = require('../../../utils/utils.js');
// var app = getApp();
// Page({
//     data: {
//         movie:{}
//     },

//     // 生命周期函数--监听页面加载
//     onLoad: function(options) {
//         var movieId = options.id;
//         var url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
//         util.http(url, this.processData);
//     },

//     // 处理返回的数据，
//     processData:function(data){
//         if(!data){
//             return;
//         }
//         var director = {
//             avatar:'',
//             name:'',
//             id:''
//         }
//         if(data.directors[0] != null){
//             if(data.directors[0].avatars != null){
//                 director.avatar = data.directors[0].avatars.large;
//             }
//             director.name = data.directors[0].name;
//             director.id = data.directors[0].id;
//         }
//         var movie = {
//             movieImg:data.images ? data.images.large : '',
//             country:data.countries[0],
//             title:data.title,
//             originalTitle:data.original_title,
//             wishCount:data.wish_count,
//             commentCount:data.comments_count,
//             year:data.year,
//             genres:data.genres.join('、'),
//             stars:util.convertToStarsArray(data.rating.stars),
//             score:data.rating.average,
//             director:director,
//             casts:util.convertToCastString(data.casts),
//             castsInfo:util.convertToCastInfos(data.casts),
//             summary:data.summary
//         }
//         console.log(movie)
//         this.setData({
//             movie:movie
//         })
//     },

//     // 查看图片大图
//     viewMoviePostImg:function(event){
//         var src = event.currentTarget.dataset.src;
//         wx.previewImage({
//             // 当前显示图片的HTTP链接
//             current:src,
//             // 需要预览图片的HTTP链接
//             urls:[src]
//         })
//     }
// })




// 上面是ES5写法，下面是ES6语法，
// 引用 Movie 类，
import {Movie} from 'class/Movie.js';
var app = getApp();
Page({
    data: {
        movie:{}
    },

    // 生命周期函数--监听页面加载
    onLoad: function(options) {
        var movieId = options.id;
        var url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
        // 实例化类，执行其方法
        var movie = new Movie(url);

        // var that = this;
        // movie.getMovieData(function(movie){
        //     that.setData({
        //         movie:movie
        //     })
        // })

        // 箭头函数写法，
        // 内部this指的是当前定义的箭头函数的上下文环境，不是调用该函数的对象，
        movie.getMovieData((movie) => {
            this.setData({
                movie:movie
            })
        })
    },

    // 查看图片大图
    viewMoviePostImg:function(event){
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
            // 当前显示图片的HTTP链接
            current:src,
            // 需要预览图片的HTTP链接
            urls:[src]
        })
    }
})