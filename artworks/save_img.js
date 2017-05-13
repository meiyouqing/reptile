// 一些依赖库
const fs = require("fs");

const save = function(buffer, path){
	path = path.split('-');
	path = path.reduce((accumulator, currentValue, currentIndex, array) => {
		if(!fs.existsSync(accumulator+currentValue) && !/\.jpg$/.test(currentValue)){
			fs.mkdirSync(accumulator+currentValue);
		}
		return accumulator+currentValue+'/';
	}, './data/')

    const out = fs.createWriteStream(path, {encoding:'utf8'});
    out.write(buffer);
    out.end();
    console.log('saved '+path);
}

exports.start = save;