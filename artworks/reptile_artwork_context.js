// 一些依赖库
var url = require("url"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    //async = require("async"),
    eventproxy = require("eventproxy")
    //analyzer = require("./analyze")
    saving = require("./save");
 
var context = {
    authors: [{
        author: 'Claude_Monet',
        artworks: []
    }, {
        author: 'Vincent_van_Gogh',
        artworks: []
    }, {
        author: 'Paul_Gauguin',
        artworks: []
    }]
};
var ep = new eventproxy();
  
// 主start程序
function start(){
    // 轮询 所有文章列表页
    var startT = Date.now();
    context.authors.forEach(v => {
        superagent.get('https://en.wikipedia.org/wiki/'+v.author)
        .end((err, res) => {
            if(err) throw err;
            const $ = cheerio.load(res.text);
                $('a.image img').each((i1,v1) => {
                v.artworks.push({
                    url:$(v1).attr('srcset')
                })
                console.log(v1)
            })
            ep.emit('getAuthors');
        })
    })
    ep.after('getAuthors', context.authors.length, () => {
        saving.start(context, 'context');
        console.log('dong in '+Math.floor((Date.now() - startT)/1000)+' seconds')
    })
}
exports.start= start;