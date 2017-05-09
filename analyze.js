// 一些依赖库
const cheerio = require("cheerio");
const saving = require("./save");

const analyze = function(data){
    const $ = cheerio.load(data);
    const result = {};
    result.author = $('#Header1_HeaderTitle').text();
    result.authorHome = $('#Header1_HeaderTitle').attr('href');
    result.postTitle = $('#cb_post_title_url').text();
    result.postLink = $('#cb_post_title_url').attr('href');
    result.postBody = $('#cnblogs_post_body').html();

    saving.start(result);
}

exports.start = analyze;