// 定义公共函数，并导出

// stars 为获取自豆瓣的数据的 rating.stars，字符串格式，两位，如‘45’，表示4颗星
// 截取字符串内容第一位，为x，则向数组添加x颗星，返回数组为 [1,1,1,1,1] 或 [1,1,1,1,0]....
function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
};


// 调用豆瓣API，添加一个回调函数参数用于响应成功后的回调，
function http(url, callback) {
    wx.request({
        url: url,
        // 提交的数据
        // data: {},
        method: 'GET',
        header: {
            // application/json、空字符串都会报错，换任意其他内容都可以，
            'Content-Type': 'json'
        },
        success: function(res) {
            // that.processData(res.data, settedKey, categoryTitle);
            callback(res.data);
        },
        fail: function() {
            console.log("fail");
        }
    })
};


// 获取数组里的某项的name属性值，添加斜杠进行拼接，去除最后一个斜杠
function convertToCastString(casts){
	var castsjoin = '';
	for(var idx in casts){
		castsjoin = castsjoin + casts[idx].name + ' / ';
	}
	return castsjoin.substring(0,castsjoin.length-2);
}


function convertToCastInfos(casts){
	var castsArray = [];
	for(var idx in casts){
		var cast = {
			img:casts[idx].avatars ? casts[idx].avatars.large : '',
			name:casts[idx].name
		}
		castsArray.push(cast);
	}
	return castsArray;
}


module.exports = {
    convertToStarsArray: convertToStarsArray,
    http: http,
    convertToCastString:convertToCastString,
    convertToCastInfos:convertToCastInfos
}