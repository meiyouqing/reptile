// 一些依赖库
var url = require("url"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    //async = require("async"),
    eventproxy = require("eventproxy")
    //analyzer = require("./analyze")
    saving = require("./save");
 
var context = {'vamei':[]};
var ep = new eventproxy();
  
// 主start程序
function start(){
        // 轮询 所有文章列表页
        var startT = Date.now();
        superagent.get('http://www.cnblogs.com/vamei/mvc/blog/sidecolumn.aspx?blogApp=vamei')
        .end((err,res)=>{
            if(err){
                console.error(err);
                return;
            }
            const $ = cheerio.load(res.text);
            const vameiSir = $('#sidebar_categories .catList li a');
            vameiSir.each((i,v)=>{
                v = $(v);
                context.vamei.push({
                    name:v.text(),
                    url:v.attr('href'),
                    children:[]
                })
                superagent.get(v.attr('href'))
                .end((err,res)=>{
                    if(err){
                        console.error(err);
                        return;
                    }
                    const $ = cheerio.load(res.text);
                    const vameiContext2 = $('#cnblogs_post_body h3');
                    if(vameiContext2.length){
                        vameiContext2.each((i1,v)=>{
                            v = $(v);
                            console.log(i+'>>>>'+v.text())
                            context.vamei[i].children.push({
                                name:v.text(),
                                children:getChildren(v)
                            })
                        })
                    }else{
                            context.vamei[i].children = getChildren($('#cnblogs_post_body p').eq(0))
                    }
                        function getChildren(node){
                        const result = [];
                        let a;
                        while(node.next().get(0) && node.next().get(0).tagName.toUpperCase() === 'P'){
                            node = node.next();
                            a = node.find('a');
                            console.log(a.text())
                            //bug resolve
                            if(a.length >1){
                                a.each((i,v)=>{
                                    if($(v).text().trim().length) a = $(v);
                                })
                            }
                            if(!a || !a.length) continue;
                            result.push({
                                name:a.text(),
                                url:a.attr('href')
                            })
                        }
                        return result;
                    }
                    ep.emit('vameiContext');
                })
            })
            ep.after('vameiContext',vameiSir.length, ()=>{
                console.log('done in '+(Date.now()-startT)+' 毫秒');
                setTimeout(function(){
                  saving.start(context);  
              },0)
                
            })
        })
}
exports.start= start;