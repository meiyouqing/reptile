const saving = require("./save");
const fs = require("fs");

fs.readFile('./data/1494321309388.json', (err,data) => {
	if(err) throw err;
	data = JSON.parse(data.toString());
	data.vamei.forEach(v => {
		format(v)
	})
	saving.start(data);
})

function format(v){
	if(v.children && v.children.length){
		v.children.forEach((v1,i) => {
			v1.name = v1.name.trim();
			if(check(v1.name)){
				v.children.splice(i,1);
			}
			format(v1);
		})
	}
}
function check(v){
	if(typeof v !== 'string') return;
	return /(^参考资料$)|(^参考书籍$)|(^http)/.test(v)
}
