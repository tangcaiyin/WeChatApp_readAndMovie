// 小程序MINA框架的模块引用，不是ES6模块引用
var util = require('../../../../utils/utils.js');

class Movie{
	constructor(url){
		this.url = url;
	}

	getMovieData(cb){
		this.cb = cb;
		
		util.http(this.url, this.processData.bind(this));
	}

	// 异步函数，内部不可使用return返回函数的执行结果
	// 处理返回的数据，
	processData(data){
        if(!data){
            return;
        }
        var director = {
            avatar:'',
            name:'',
            id:''
        }
        if(data.directors[0] != null){
            if(data.directors[0].avatars != null){
                director.avatar = data.directors[0].avatars.large;
            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }
        var movie = {
            movieImg:data.images ? data.images.large : '',
            country:data.countries[0],
            title:data.title,
            originalTitle:data.original_title,
            wishCount:data.wish_count,
            commentCount:data.comments_count,
            year:data.year,
            genres:data.genres.join('、'),
            stars:util.convertToStarsArray(data.rating.stars),
            score:data.rating.average,
            director:director,
            casts:util.convertToCastString(data.casts),
            castsInfo:util.convertToCastInfos(data.casts),
            summary:data.summary
        }
        console.log(movie)
        this.cb(movie)
    }
}

export {Movie}