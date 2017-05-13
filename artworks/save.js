// 一些依赖库
const fs = require("fs");

const save = function(obj, path){
	path = path.split('-');
	path = path.reduce((accumulator, currentValue, currentIndex, array) => {
		if(!fs.existsSync(accumulator+currentValue)){
			fs.mkdirSync(accumulator+currentValue);
		}
		return accumulator+currentValue+'/';
	}, './data/')

    const js = JSON.stringify(obj)
    fs.writeFileSync(path+'article.json', js)
    console.log('saved '+path+'article.json');
}

exports.start = save;