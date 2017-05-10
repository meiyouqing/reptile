const saving = require("./save");
const fs = require("fs");
const superagent = require("superagent"),
	    cheerio = require("cheerio"),
	    async = require("async"),
	    eventproxy = require("eventproxy");

let count = 0;
const startT = Date.now();
const eq = new eventproxy();

fs.readFile('./data/1494321711385.json', (err,data) => {
	if(err) throw err;
	data = JSON.parse(data.toString());
	data.vamei.forEach((v,i) => {
		getArticle(v,i)
	})
	eq.after('savingArticle', count, ()=>{
		console.log('done in '+(Date.now()-startT)+' minisecondes');
	})
})

function getArticle(v,i){
	if(v.children && v.children.length){
		v.children.forEach((v1,i1) => {
			const delay = Math.ceil(Math.random()*3000);
			const path = i+'-'+i1;
			getArticle(v1,path);
			if(!v1.url) return;
			count++;
			setTimeout(function(){
				superagent.get(v1.url)
				.end((err,res) => {
					if(err) throw err;
					const $ = cheerio.load(res.text);
					saving.start({content:$('#cnblogs_post_body').html()}, path);
					eq.emit('savingArticle');
				})
			},delay)
		})
	}
}

