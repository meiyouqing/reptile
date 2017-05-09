// 一些依赖库
const fs = require("fs");

const save = function(obj){
    const js = JSON.stringify(obj)
    const filename = Date.now();
    fs.writeFileSync('./data/'+filename+'.json', js)
    console.log('saved '+filename+'.json');
}

exports.start = save;