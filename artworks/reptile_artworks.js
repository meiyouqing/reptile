const saving = require("./save_img");
const fs = require("fs");
const superagent = require("superagent"),
	    cheerio = require("cheerio"),
	    // async = require("async"),
	    eventproxy = require("eventproxy");

let count = 0;
const startT = Date.now();
const eq = new eventproxy();

fs.readFile('./data/context/artworks.json', (err,data) => {
	if(err) throw err;
	data = JSON.parse(data.toString());
	data.authors.forEach((v,i) => {
		getArticle(v,i)
	})
	eq.after('savingArticle', count, ()=>{
		console.log('done '+count+' jpg in '+(Date.now()-startT)+' minisecondes');
	})
})

function getArticle(v,i){
	if(v.artworks && v.artworks.length){
		v.artworks.forEach((v1,i1) => {
			const delay = Math.ceil(Math.random()*3000);
			if(!v1.url) return;
			count++;
			let url = v1.url.split(',').map(v=>{
				return v.trim().replace(/(\s\d\.\dx)$|(\s\dx)$/,'')
			})
			url = url[url.length-1];
			const path = v.author+'-'+i1+'.jpg';
			setTimeout(function(){
				superagent.get('https:'+url)
				.end((err,res) => {
					if(err) throw err;
					saving.start(res.body, path);
					eq.emit('savingArticle');
				})
			},delay)
		})
	}
}

