// 一些依赖库
var url = require("url"),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async"),
    eventproxy = require("eventproxy")
    analyzer = require("./analyze");
 
var ep = new eventproxy(),
    urlsArray = [], //存放爬取网址
    pageUrls = [],  //存放收集文章页面网站
    pageNum = 200;  //要爬取文章的页数
 
for(var i=1 ; i<= 1 ; i++){
    pageUrls.push('http://www.cnblogs.com/?CategoryId=808&CategoryType=%22SiteHome%22&ItemListActionName=%22PostList%22&PageIndex='+ i +'&ParentCategoryId=0');
}
 
// 主start程序
function start(){
        // 轮询 所有文章列表页
        var startT = Date.now();
        pageUrls.forEach(function(pageUrl){
            superagent.get(pageUrl)
                .end(function(err,pres){
              // pres.text 里面存储着请求返回的 html 内容，将它传给 cheerio.load 之后
              // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
              // 剩下就都是利用$ 使用 jquery 的语法了
              var $ = cheerio.load(pres.text);
              var curPageUrls = $('.titlelnk');
 
              for(var i = 0 ; i < curPageUrls.length ; i++){
                var articleUrl = curPageUrls.eq(i).attr('href');
                urlsArray.push(articleUrl);

                // 相当于一个计数器
                ep.emit('BlogArticleHtml', articleUrl);
              }
            });
        });
 
        ep.after('BlogArticleHtml', 20 ,function(articleUrls){
            // 当所有 'BlogArticleHtml' 事件完成后的回调触发下面事件
            // ...
            var curCount = 0;
            var reptileMove = function(url,callback){
                //延迟毫秒数
                var delay = parseInt((Math.random() * 30000000) % 1000, 10);
                curCount++;

                console.log('现在的并发数是', curCount, '，正在抓取的是', url, '，延时' + delay + '毫秒'); 
                // 拼接URL
                superagent.get(url)
                .end(function(err,sres){
                    if(err) {
                        console.error(err);
                        return;
                    }
                    analyzer.start(sres.text);
                });
         
                setTimeout(function() {
                    curCount--;
                    callback(null,url +'Call back content');
                }, delay);     
            };
         
            // 使用async控制异步抓取   
            // mapLimit(arr, limit, iterator, [callback])
            // 异步回调
            async.mapLimit(articleUrls, 5 , reptileMove, function (err,result) {
                // 4000 个 URL 访问完成的回调函数
                // ...
                var time = (Date.now() - startT)/1000;
                console.log('爬取 '+articleUrls.length+' 个链接，总耗时 '+time+' 秒');
            });
        });
}
exports.start= start;