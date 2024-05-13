const Router = require("@koa/router");
const config = require("@/config").value;
const nativeRequire = require;
const lazyRouter = require("@/utils/lazy_router");
const mount = require("koa-mount");
const lazyRequire = (id) => lazyRouter(() => nativeRequire(id));
const router = new Router();

router.get("/robots.txt", async (ctx) => {
  if (config.disallowRobot) {
    ctx.set("Content-Type", "text/plain");
    ctx.body = "User-agent: *\nDisallow: /";
  } else {
    ctx.throw(404, "Not Found");
  }
});

router.use(mount("/", require("./customize").routes()));

// index
router.get("/", lazyRequire("./routes/index"));

// test
router.get("/test/:id", lazyRequire("./routes/test"));

// RSSHub
// router.get('/rsshub/rss', require('./routes/rsshub/routes')); // 弃用
// router.get('/rsshub/routes', require('./routes/rsshub/routes'));
// router.get('/rsshub/sponsors', require('./routes/rsshub/sponsors'));

// 1draw
router.get("/1draw", lazyRequire("./routes/1draw/index"));

// quicker
router.get("/quicker/qa", lazyRequire("./routes/quicker/qa.js"));
router.get("/quicker/update", lazyRequire("./routes/quicker/update.js"));
router.get("/quicker/user/action/:uid/:person", lazyRequire("./routes/quicker/person.js"));
router.get("/quicker/user/:uid/:person", lazyRequire("./routes/quicker/person.js"));

// bilibili
router.get("/bilibili/user/video/:uid/:disableEmbed?", lazyRequire("./routes/bilibili/video"));
router.get("/bilibili/user/article/:uid", lazyRequire("./routes/bilibili/article"));
router.get("/bilibili/user/fav/:uid/:disableEmbed?", lazyRequire("./routes/bilibili/userFav"));
router.get("/bilibili/user/coin/:uid/:disableEmbed?", lazyRequire("./routes/bilibili/coin"));
router.get("/bilibili/user/dynamic/:uid/:disableEmbed?", lazyRequire("./routes/bilibili/dynamic"));
router.get("/bilibili/user/followers/:uid", lazyRequire("./routes/bilibili/followers"));
router.get("/bilibili/user/followings/:uid", lazyRequire("./routes/bilibili/followings"));
router.get("/bilibili/user/bangumi/:uid/:type?", lazyRequire("./routes/bilibili/user_bangumi"));
router.get("/bilibili/partion/:tid/:disableEmbed?", lazyRequire("./routes/bilibili/partion"));
router.get("/bilibili/partion/ranking/:tid/:days?/:disableEmbed?", lazyRequire("./routes/bilibili/partion-ranking"));
router.get("/bilibili/bangumi/:seasonid", lazyRequire("./routes/bilibili/bangumi")); // 弃用
router.get("/bilibili/bangumi/media/:mediaid", lazyRequire("./routes/bilibili/bangumi"));
router.get("/bilibili/video/page/:bvid/:disableEmbed?", lazyRequire("./routes/bilibili/page"));
router.get("/bilibili/video/reply/:bvid", lazyRequire("./routes/bilibili/reply"));
router.get("/bilibili/video/danmaku/:bvid/:pid?", lazyRequire("./routes/bilibili/danmaku"));
router.get("/bilibili/link/news/:product", lazyRequire("./routes/bilibili/linkNews"));
router.get("/bilibili/live/room/:roomID", lazyRequire("./routes/bilibili/liveRoom"));
router.get("/bilibili/live/search/:key/:order", lazyRequire("./routes/bilibili/liveSearch"));
router.get("/bilibili/live/area/:areaID/:order", lazyRequire("./routes/bilibili/liveArea"));
router.get("/bilibili/fav/:uid/:fid/:disableEmbed?", lazyRequire("./routes/bilibili/fav"));
router.get("/bilibili/blackboard", lazyRequire("./routes/bilibili/blackboard"));
router.get("/bilibili/mall/new/:category?", lazyRequire("./routes/bilibili/mallNew"));
router.get("/bilibili/mall/ip/:id", lazyRequire("./routes/bilibili/mallIP"));
router.get("/bilibili/ranking/:rid?/:day?/:arc_type?/:disableEmbed?", lazyRequire("./routes/bilibili/ranking"));
router.get("/bilibili/user/channel/:uid/:cid/:disableEmbed?", lazyRequire("./routes/bilibili/userChannel"));
router.get("/bilibili/topic/:topic", lazyRequire("./routes/bilibili/topic"));
router.get("/bilibili/audio/:id", lazyRequire("./routes/bilibili/audio"));
router.get("/bilibili/vsearch/:kw/:order?/:disableEmbed?", lazyRequire("./routes/bilibili/vsearch"));
router.get("/bilibili/followings/video/:uid/:disableEmbed?", lazyRequire("./routes/bilibili/followings_video"));
router.get("/bilibili/followings/article/:uid", lazyRequire("./routes/bilibili/followings_article"));
router.get("/bilibili/readlist/:listid", lazyRequire("./routes/bilibili/readlist"));
router.get("/bilibili/weekly", lazyRequire("./routes/bilibili/weekly_recommend"));
router.get("/bilibili/manga/update/:comicid", lazyRequire("./routes/bilibili/manga_update"));

// bangumi
router.get("/bangumi/calendar/today", lazyRequire("./routes/bangumi/calendar/today"));
router.get("/bangumi/subject/:id/:type", lazyRequire("./routes/bangumi/subject"));
router.get("/bangumi/person/:id", lazyRequire("./routes/bangumi/person"));
router.get("/bangumi/topic/:id", lazyRequire("./routes/bangumi/group/reply"));
router.get("/bangumi/group/:id", lazyRequire("./routes/bangumi/group/topic"));
router.get("/bangumi/subject/:id", lazyRequire("./routes/bangumi/subject"));
router.get("/bangumi/user/blog/:id", lazyRequire("./routes/bangumi/user/blog"));

// 微博
router.get("/weibo/keyword/:keyword", lazyRequire("./routes/weibo/keyword"));
router.get("/weibo/search/hot", lazyRequire("./routes/weibo/search/hot"));
router.get("/weibo/super_index/:id", lazyRequire("./routes/weibo/super_index"));
router.get("/weibo/oasis/user/:userid", lazyRequire("./routes/weibo/oasis/user"));

// 贴吧
router.get("/tieba/forum/:kw", lazyRequire("./routes/tieba/forum"));
router.get("/tieba/forum/good/:kw/:cid?", lazyRequire("./routes/tieba/forum"));
router.get("/tieba/post/:id", lazyRequire("./routes/tieba/post"));
router.get("/tieba/post/lz/:id", lazyRequire("./routes/tieba/post"));

// 网易云音乐
router.get("/ncm/playlist/:id", lazyRequire("./routes/ncm/playlist"));
router.get("/ncm/user/playlist/:uid", lazyRequire("./routes/ncm/userplaylist"));
router.get("/ncm/artist/:id", lazyRequire("./routes/ncm/artist"));
router.get("/ncm/djradio/:id", lazyRequire("./routes/ncm/djradio"));

// 掘金
router.get("/juejin/category/:category", lazyRequire("./routes/juejin/category"));
router.get("/juejin/tag/:tag", lazyRequire("./routes/juejin/tag"));
router.get("/juejin/trending/:category/:type", lazyRequire("./routes/juejin/trending"));
router.get("/juejin/books", lazyRequire("./routes/juejin/books"));
router.get("/juejin/pins", lazyRequire("./routes/juejin/pins"));
router.get("/juejin/posts/:id", lazyRequire("./routes/juejin/posts"));
router.get("/juejin/collections/:userId", lazyRequire("./routes/juejin/favorites"));
router.get("/juejin/collection/:collectionId", lazyRequire("./routes/juejin/collection"));
router.get("/juejin/shares/:userId", lazyRequire("./routes/juejin/shares"));

// 自如
router.get("/ziroom/room/:city/:iswhole/:room/:keyword", lazyRequire("./routes/ziroom/room"));

// 简书
router.get("/jianshu/home", lazyRequire("./routes/jianshu/home"));
router.get("/jianshu/trending/:timeframe", lazyRequire("./routes/jianshu/trending"));
router.get("/jianshu/collection/:id", lazyRequire("./routes/jianshu/collection"));
router.get("/jianshu/user/:id", lazyRequire("./routes/jianshu/user"));

// 知乎
router.get("/zhihu/collection/:id", lazyRequire("./routes/zhihu/collection"));
router.get("/zhihu/people/activities/:id", lazyRequire("./routes/zhihu/activities"));
router.get("/zhihu/people/answers/:id", lazyRequire("./routes/zhihu/answers"));
router.get("/zhihu/people/posts/:id", lazyRequire("./routes/zhihu/posts"));
router.get("/zhihu/zhuanlan/:id", lazyRequire("./routes/zhihu/zhuanlan"));
router.get("/zhihu/daily", lazyRequire("./routes/zhihu/daily"));
router.get("/zhihu/daily/section/:sectionId", lazyRequire("./routes/zhihu/daily_section"));
router.get("/zhihu/hotlist", lazyRequire("./routes/zhihu/hotlist"));
router.get("/zhihu/pin/hotlist", lazyRequire("./routes/zhihu/pin/hotlist"));
router.get("/zhihu/question/:questionId", lazyRequire("./routes/zhihu/question"));
router.get("/zhihu/topic/:topicId", lazyRequire("./routes/zhihu/topic"));
router.get("/zhihu/people/pins/:id", lazyRequire("./routes/zhihu/pin/people"));
router.get("/zhihu/bookstore/newest", lazyRequire("./routes/zhihu/bookstore/newest"));
router.get("/zhihu/pin/daily", lazyRequire("./routes/zhihu/pin/daily"));
router.get("/zhihu/weekly", lazyRequire("./routes/zhihu/weekly"));

// 妹子图
router.get("/mzitu/home/:type?", lazyRequire("./routes/mzitu/home"));
router.get("/mzitu/tags", lazyRequire("./routes/mzitu/tags"));
router.get("/mzitu/category/:category", lazyRequire("./routes/mzitu/category"));
router.get("/mzitu/post/:id", lazyRequire("./routes/mzitu/post"));
router.get("/mzitu/tag/:tag", lazyRequire("./routes/mzitu/tag"));

// pixiv
router.get("/pixiv/user/bookmarks/:id", lazyRequire("./routes/pixiv/bookmarks"));
router.get("/pixiv/user/illustfollows", lazyRequire("./routes/pixiv/illustfollow"));
router.get("/pixiv/user/:id", lazyRequire("./routes/pixiv/user"));
router.get("/pixiv/ranking/:mode/:date?", lazyRequire("./routes/pixiv/ranking"));
router.get("/pixiv/search/:keyword/:order?/:r18?", lazyRequire("./routes/pixiv/search"));

// pixiv-fanbox
router.get("/fanbox/:user?", lazyRequire("./routes/fanbox/main"));

// 豆瓣
router.get("/douban/movie/playing", lazyRequire("./routes/douban/playing"));
router.get("/douban/movie/playing/:score", lazyRequire("./routes/douban/playing"));
router.get("/douban/movie/playing/:score/:city", lazyRequire("./routes/douban/playing"));
router.get("/douban/movie/later", lazyRequire("./routes/douban/later"));
router.get("/douban/movie/ustop", lazyRequire("./routes/douban/ustop"));
router.get("/douban/movie/weekly", lazyRequire("./routes/douban/weekly_best"));
router.get("/douban/movie/classification/:sort?/:score?/:tags?", lazyRequire("./routes/douban/classification.js"));
router.get("/douban/group/:groupid", lazyRequire("./routes/douban/group"));
router.get("/douban/explore", lazyRequire("./routes/douban/explore"));
router.get("/douban/music/latest/:area?", lazyRequire("./routes/douban/latest_music"));
router.get("/douban/book/latest", lazyRequire("./routes/douban/latest_book"));
router.get("/douban/event/hot/:locationId", lazyRequire("./routes/douban/event/hot"));
router.get("/douban/commercialpress/latest", lazyRequire("./routes/douban/commercialpress/latest"));
router.get("/douban/bookstore", lazyRequire("./routes/douban/bookstore"));
router.get("/douban/book/rank/:type?", lazyRequire("./routes/douban/book/rank"));
router.get("/douban/doulist/:id", lazyRequire("./routes/douban/doulist"));
router.get("/douban/explore/column/:id", lazyRequire("./routes/douban/explore_column"));
router.get("/douban/people/:userid/status", lazyRequire("./routes/douban/people/status.js"));
router.get("/douban/replies/:uid", lazyRequire("./routes/douban/replies"));
router.get("/douban/topic/:id/:sort?", lazyRequire("./routes/douban/topic.js"));
router.get("/douban/channel/:id/:nav?", lazyRequire("./routes/douban/channel/topic.js"));
router.get("/douban/channel/:id/subject/:nav", lazyRequire("./routes/douban/channel/subject.js"));
router.get("/douban/celebrity/:id/:sort?", lazyRequire("./routes/douban/celebrity.js"));

// 法律白話文運動
router.get("/plainlaw/archives", lazyRequire("./routes/plainlaw/archives.js"));

// 煎蛋
router.get("/jandan/:sub_model", lazyRequire("./routes/jandan/pic"));

// 喷嚏
router.get("/dapenti/tugua", lazyRequire("./routes/dapenti/tugua"));
router.get("/dapenti/subject/:id", lazyRequire("./routes/dapenti/subject"));

// Dockone
router.get("/dockone/weekly", lazyRequire("./routes/dockone/weekly"));

// 开发者头条
router.get("/toutiao/today", lazyRequire("./routes/toutiao/today"));
router.get("/toutiao/user/:id", lazyRequire("./routes/toutiao/user"));

// 众成翻译
router.get("/zcfy", lazyRequire("./routes/zcfy/index"));
router.get("/zcfy/index", lazyRequire("./routes/zcfy/index")); // 废弃
router.get("/zcfy/hot", lazyRequire("./routes/zcfy/hot"));

// 今日头条
router.get("/jinritoutiao/keyword/:keyword", lazyRequire("./routes/jinritoutiao/keyword"));

// Disqus
router.get("/disqus/posts/:forum", lazyRequire("./routes/disqus/posts"));

// Twitter
router.get("/twitter/user/:id/:type?", lazyRequire("./routes/twitter/user"));
router.get("/twitter/list/:id/:name", lazyRequire("./routes/twitter/list"));
router.get("/twitter/likes/:id", lazyRequire("./routes/twitter/likes"));
router.get("/twitter/followings/:id", lazyRequire("./routes/twitter/followings"));
router.get("/twitter/keyword/:keyword", lazyRequire("./routes/twitter/keyword"));
router.get("/twitter/trends/:woeid?", lazyRequire("./routes/twitter/trends"));

// Youtube
router.get("/youtube/user/:username/:embed?", lazyRequire("./routes/youtube/user"));
router.get("/youtube/channel/:id/:embed?", lazyRequire("./routes/youtube/channel"));
router.get("/youtube/playlist/:id/:embed?", lazyRequire("./routes/youtube/playlist"));

// 极客时间
router.get("/geektime/column/:cid", lazyRequire("./routes/geektime/column"));
router.get("/geektime/news", lazyRequire("./routes/geektime/news"));

// 界面新闻
router.get("/jiemian/list/:cid", lazyRequire("./routes/jiemian/list.js"));

// 好奇心日报
router.get("/qdaily/:type/:id", lazyRequire("./routes/qdaily/index"));

// 爱奇艺
router.get("/iqiyi/dongman/:id", lazyRequire("./routes/iqiyi/dongman"));
router.get("/iqiyi/user/video/:uid", lazyRequire("./routes/iqiyi/video"));

// 南方周末
router.get("/infzm/:id", lazyRequire("./routes/infzm/news"));

// Dribbble
router.get("/dribbble/popular/:timeframe?", lazyRequire("./routes/dribbble/popular"));
router.get("/dribbble/user/:name", lazyRequire("./routes/dribbble/user"));
router.get("/dribbble/keyword/:keyword", lazyRequire("./routes/dribbble/keyword"));

// 斗鱼
router.get("/douyu/room/:id", lazyRequire("./routes/douyu/room"));

// 虎牙
router.get("/huya/live/:id", lazyRequire("./routes/huya/live"));

// 浪Play(原kingkong)直播
router.get("/kingkong/room/:id", lazyRequire("./routes/langlive/room"));
router.get("/langlive/room/:id", lazyRequire("./routes/langlive/room"));

// SHOWROOM直播
router.get("/showroom/room/:id", lazyRequire("./routes/showroom/room"));

// v2ex
router.get("/v2ex/topics/:type", lazyRequire("./routes/v2ex/topics"));
router.get("/v2ex/post/:postid", lazyRequire("./routes/v2ex/post"));
router.get("/v2ex/tab/:tabid", lazyRequire("./routes/v2ex/tab"));

// Telegram
router.get("/telegram/channel/:username/:searchQuery?", lazyRequire("./routes/telegram/channel"));
router.get("/telegram/stickerpack/:name", lazyRequire("./routes/telegram/stickerpack"));
router.get("/telegram/blog", lazyRequire("./routes/telegram/blog"));

// readhub
router.get("/readhub/category/:category", lazyRequire("./routes/readhub/category"));

// GitHub
router.get("/github/repos/:user", lazyRequire("./routes/github/repos"));
router.get("/github/issue/:user/:repo/:state?/:labels?", lazyRequire("./routes/github/issue"));
router.get("/github/pull/:user/:repo", lazyRequire("./routes/github/pulls"));
router.get("/github/user/followers/:user", lazyRequire("./routes/github/follower"));
router.get("/github/stars/:user/:repo", lazyRequire("./routes/github/star"));
router.get("/github/search/:query/:sort?/:order?", lazyRequire("./routes/github/search"));
router.get("/github/branches/:user/:repo", lazyRequire("./routes/github/branches"));
router.get("/github/file/:user/:repo/:branch/:filepath+", lazyRequire("./routes/github/file"));
router.get("/github/starred_repos/:user", lazyRequire("./routes/github/starred_repos"));
router.get("/github/contributors/:user/:repo/:order?/:anon?", lazyRequire("./routes/github/contributors"));

// f-droid
router.get("/fdroid/apprelease/:app", lazyRequire("./routes/fdroid/apprelease"));

// konachan
router.get("/konachan/post/popular_recent", lazyRequire("./routes/konachan/post_popular_recent"));
router.get("/konachan.com/post/popular_recent", lazyRequire("./routes/konachan/post_popular_recent"));
router.get("/konachan.net/post/popular_recent", lazyRequire("./routes/konachan/post_popular_recent"));
router.get("/konachan/post/popular_recent/:period", lazyRequire("./routes/konachan/post_popular_recent"));
router.get("/konachan.com/post/popular_recent/:period", lazyRequire("./routes/konachan/post_popular_recent"));
router.get("/konachan.net/post/popular_recent/:period", lazyRequire("./routes/konachan/post_popular_recent"));

// PornHub
router.get("/pornhub/category/:caty", lazyRequire("./routes/pornhub/category"));
router.get("/pornhub/search/:keyword", lazyRequire("./routes/pornhub/search"));
router.get("/pornhub/category_url/:url?", lazyRequire("./routes/pornhub/category_url"));
router.get("/pornhub/users/:username", lazyRequire("./routes/pornhub/users"));
router.get("/pornhub/model/:username/:sort?", lazyRequire("./routes/pornhub/model"));
router.get("/pornhub/pornstar/:username/:sort?", lazyRequire("./routes/pornhub/pornstar"));

// yande.re
router.get("/yande.re/post/popular_recent", lazyRequire("./routes/yande.re/post_popular_recent"));
router.get("/yande.re/post/popular_recent/:period", lazyRequire("./routes/yande.re/post_popular_recent"));

// 纽约时报
router.get("/nytimes/morning_post", lazyRequire("./routes/nytimes/morning_post"));
router.get("/nytimes/:lang?", lazyRequire("./routes/nytimes/index"));

// 3dm
router.get("/3dm/:name/:type", lazyRequire("./routes/3dm/game"));

// 旅法师营地
router.get("/lfsyd/:typecode", lazyRequire("./routes/lfsyd/index"));

// 喜马拉雅
router.get("/ximalaya/album/:id/:all?", lazyRequire("./routes/ximalaya/album"));

// 什么值得买
router.get("/smzdm/keyword/:keyword", lazyRequire("./routes/smzdm/keyword"));
router.get("/smzdm/ranking/:rank_type/:rank_id/:hour", lazyRequire("./routes/smzdm/ranking"));
router.get("/smzdm/haowen/:day?", lazyRequire("./routes/smzdm/haowen"));
router.get("/smzdm/haowen/fenlei/:name/:sort?", lazyRequire("./routes/smzdm/haowen_fenlei"));
router.get("/smzdm/article/:uid", lazyRequire("./routes/smzdm/article"));
router.get("/smzdm/baoliao/:uid", lazyRequire("./routes/smzdm/baoliao"));

// 新京报
router.get("/bjnews/:cat", lazyRequire("./routes/bjnews/news"));
router.get("/bjnews/epaper/:cat", lazyRequire("./routes/bjnews/epaper"));

// 停水通知
router.get("/tingshuitz/hangzhou", lazyRequire("./routes/tingshuitz/hangzhou"));
router.get("/tingshuitz/xiaoshan", lazyRequire("./routes/tingshuitz/xiaoshan"));
router.get("/tingshuitz/dalian", lazyRequire("./routes/tingshuitz/dalian"));
router.get("/tingshuitz/guangzhou", lazyRequire("./routes/tingshuitz/guangzhou"));
router.get("/tingshuitz/dongguan", lazyRequire("./routes/tingshuitz/dongguan"));
router.get("/tingshuitz/xian", lazyRequire("./routes/tingshuitz/xian"));
router.get("/tingshuitz/yangjiang", lazyRequire("./routes/tingshuitz/yangjiang"));
router.get("/tingshuitz/nanjing", lazyRequire("./routes/tingshuitz/nanjing"));
router.get("/tingshuitz/wuhan", lazyRequire("./routes/tingshuitz/wuhan"));

// 米哈游
router.get("/mihoyo/bh3/:type", lazyRequire("./routes/mihoyo/bh3"));
router.get("/mihoyo/bh2/:type", lazyRequire("./routes/mihoyo/bh2"));

// 新闻联播
router.get("/cctv/xwlb", lazyRequire("./routes/cctv/xwlb"));
// 央视新闻
router.get("/cctv/:category", lazyRequire("./routes/cctv/category"));
router.get("/cctv-special/:id?", lazyRequire("./routes/cctv/special"));

// 财新博客
router.get("/caixin/blog/:column", lazyRequire("./routes/caixin/blog"));
// 财新
router.get("/caixin/:column/:category", lazyRequire("./routes/caixin/category"));
// 财新首页
router.get("/caixin/article", lazyRequire("./routes/caixin/article"));

// 草榴社区
router.get("/t66y/post/:tid", lazyRequire("./routes/t66y/post"));
router.get("/t66y/:id/:type?", lazyRequire("./routes/t66y/index"));

// 色中色
router.get("/sexinsex/:id/:type?", lazyRequire("./routes/sexinsex/index"));

// 国家地理
router.get("/natgeo/dailyphoto", lazyRequire("./routes/natgeo/dailyphoto"));
router.get("/natgeo/:cat/:type?", lazyRequire("./routes/natgeo/natgeo"));

// 一个
router.get("/one", lazyRequire("./routes/one/index"));

// Firefox
router.get("/firefox/release/:platform", lazyRequire("./routes/firefox/release"));
router.get("/firefox/addons/:id", lazyRequire("./routes/firefox/addons"));

// Thunderbird
router.get("/thunderbird/release", lazyRequire("./routes/thunderbird/release"));

// tuicool
router.get("/tuicool/mags/:type", lazyRequire("./routes/tuicool/mags"));

// Hexo
router.get("/hexo/next/:url", lazyRequire("./routes/hexo/next"));
router.get("/hexo/yilia/:url", lazyRequire("./routes/hexo/yilia"));

// cpython
router.get("/cpython/:pre?", lazyRequire("./routes/cpython"));

// 小米
router.get("/mi/golden", lazyRequire("./routes/mi/golden"));
router.get("/mi/crowdfunding", lazyRequire("./routes/mi/crowdfunding"));
router.get("/mi/youpin/crowdfunding", lazyRequire("./routes/mi/youpin/crowdfunding"));
router.get("/mi/youpin/new", lazyRequire("./routes/mi/youpin/new"));
router.get("/miui/:device/:type?/:region?", lazyRequire("./routes/mi/miui/index"));
router.get("/mi/bbs/board/:boardId", lazyRequire("./routes/mi/board"));

// Keep
router.get("/keep/user/:id", lazyRequire("./routes/keep/user"));

// 起点
router.get("/qidian/chapter/:id", lazyRequire("./routes/qidian/chapter"));
router.get("/qidian/forum/:id", lazyRequire("./routes/qidian/forum"));
router.get("/qidian/free/:type?", lazyRequire("./routes/qidian/free"));
router.get("/qidian/free-next/:type?", lazyRequire("./routes/qidian/free-next"));

// 纵横
router.get("/zongheng/chapter/:id", lazyRequire("./routes/zongheng/chapter"));

// 刺猬猫
router.get("/ciweimao/chapter/:id", lazyRequire("./routes/ciweimao/chapter"));

// 中国美术馆
router.get("/namoc/announcement", lazyRequire("./routes/namoc/announcement"));
router.get("/namoc/news", lazyRequire("./routes/namoc/news"));
router.get("/namoc/media", lazyRequire("./routes/namoc/media"));
router.get("/namoc/exhibition", lazyRequire("./routes/namoc/exhibition"));
router.get("/namoc/specials", lazyRequire("./routes/namoc/specials"));

// 懂球帝
router.get("/dongqiudi/daily", lazyRequire("./routes/dongqiudi/daily"));
router.get("/dongqiudi/result/:team", lazyRequire("./routes/dongqiudi/result"));
router.get("/dongqiudi/team_news/:team", lazyRequire("./routes/dongqiudi/team_news"));
router.get("/dongqiudi/player_news/:id", lazyRequire("./routes/dongqiudi/player_news"));
router.get("/dongqiudi/special/:id", lazyRequire("./routes/dongqiudi/special"));
router.get("/dongqiudi/top_news/:id?", lazyRequire("./routes/dongqiudi/top_news"));

// 维基百科 Wikipedia
router.get("/wikipedia/mainland", lazyRequire("./routes/wikipedia/mainland"));

// 联合国 United Nations
router.get("/un/scveto", lazyRequire("./routes/un/scveto"));

// e 公司
router.get("/egsea/flash", lazyRequire("./routes/egsea/flash"));

// 选股宝
router.get("/xuangubao/subject/:subject_id", lazyRequire("./routes/xuangubao/subject"));

// 雪球
router.get("/xueqiu/user/:id/:type?", lazyRequire("./routes/xueqiu/user"));
router.get("/xueqiu/favorite/:id", lazyRequire("./routes/xueqiu/favorite"));
router.get("/xueqiu/user_stock/:id", lazyRequire("./routes/xueqiu/user_stock"));
router.get("/xueqiu/fund/:id", lazyRequire("./routes/xueqiu/fund"));
router.get("/xueqiu/stock_info/:id/:type?", lazyRequire("./routes/xueqiu/stock_info"));
router.get("/xueqiu/snb/:id", lazyRequire("./routes/xueqiu/snb"));
router.get("/xueqiu/hots", lazyRequire("./routes/xueqiu/hots"));

// Greasy Fork
router.get("/greasyfork/:language/:domain?", lazyRequire("./routes/greasyfork/scripts"));

// LinkedKeeper
router.get("/linkedkeeper/:type/:id?", lazyRequire("./routes/linkedkeeper/index"));

// 开源中国
router.get("/oschina/news/:category?", lazyRequire("./routes/oschina/news"));
router.get("/oschina/user/:id", lazyRequire("./routes/oschina/user"));
router.get("/oschina/u/:id", lazyRequire("./routes/oschina/u"));
router.get("/oschina/topic/:topic", lazyRequire("./routes/oschina/topic"));

// 安全客
router.get("/aqk/vul", lazyRequire("./routes/aqk/vul"));
router.get("/aqk/:category", lazyRequire("./routes/aqk/category"));

// 腾讯游戏开发者社区
router.get("/gameinstitute/community/:tag?", lazyRequire("./routes/tencent/gameinstitute/community"));

// 腾讯视频 SDK
router.get("/qcloud/mlvb/changelog", lazyRequire("./routes/tencent/qcloud/mlvb/changelog"));

// 腾讯吐个槽
router.get("/tucaoqq/post/:project/:key", lazyRequire("./routes/tencent/tucaoqq/post"));

// Bugly SDK
router.get("/bugly/changelog/:platform", lazyRequire("./routes/tencent/bugly/changelog"));

// wechat
router.get("/wechat/wemp/:id", lazyRequire("./routes/tencent/wechat/wemp"));
router.get("/wechat/csm/:id", lazyRequire("./routes/tencent/wechat/csm"));
router.get("/wechat/ce/:id", lazyRequire("./routes/tencent/wechat/ce"));
router.get("/wechat/announce", lazyRequire("./routes/tencent/wechat/announce"));
router.get("/wechat/miniprogram/plugins", lazyRequire("./routes/tencent/wechat/miniprogram/plugins"));
router.get("/wechat/tgchannel/:id", lazyRequire("./routes/tencent/wechat/tgchannel"));
router.get("/wechat/uread/:userid", lazyRequire("./routes/tencent/wechat/uread"));
router.get("/wechat/ershicimi/:id", lazyRequire("./routes/tencent/wechat/ershcimi"));
router.get("/wechat/wjdn/:id", lazyRequire("./routes/tencent/wechat/wjdn"));
router.get("/wechat/mp/homepage/:biz/:hid/:cid?", lazyRequire("./routes/tencent/wechat/mp"));
router.get("/wechat/mp/msgalbum/:biz/:aid", lazyRequire("./routes/tencent/wechat/msgalbum"));

// All the Flight Deals
router.get("/atfd/:locations/:nearby?", lazyRequire("./routes/atfd/index"));

// Fir
router.get("/fir/update/:id", lazyRequire("./routes/fir/update"));

// Nvidia Web Driver
router.get("/nvidia/webdriverupdate", lazyRequire("./routes/nvidia/webdriverupdate"));

// Google
router.get("/google/citations/:id", lazyRequire("./routes/google/citations"));
router.get("/google/scholar/:query", lazyRequire("./routes/google/scholar"));
router.get("/google/doodles/:language?", lazyRequire("./routes/google/doodles"));
router.get("/google/album/:id", lazyRequire("./routes/google/album"));
router.get("/google/sites/:id", lazyRequire("./routes/google/sites"));

// 每日环球展览 iMuseum
router.get("/imuseum/:city/:type?", lazyRequire("./routes/imuseum"));

// AppStore
router.get("/appstore/update/:country/:id", lazyRequire("./routes/apple/appstore/update"));
router.get("/appstore/price/:country/:type/:id", lazyRequire("./routes/apple/appstore/price"));
router.get("/appstore/iap/:country/:id", lazyRequire("./routes/apple/appstore/in-app-purchase"));
router.get("/appstore/xianmian", lazyRequire("./routes/apple/appstore/xianmian"));
router.get("/appstore/gofans", lazyRequire("./routes/apple/appstore/gofans"));

// Hopper
router.get("/hopper/:lowestOnly/:from/:to?", lazyRequire("./routes/hopper/index"));

// 马蜂窝
router.get("/mafengwo/note/:type", lazyRequire("./routes/mafengwo/note"));
router.get("/mafengwo/ziyouxing/:code", lazyRequire("./routes/mafengwo/ziyouxing"));

// 中国地震局震情速递（与地震台网同步更新）
router.get("/earthquake/:region?", lazyRequire("./routes/earthquake"));

// 中国地震台网
router.get("/earthquake/ceic/:type", lazyRequire("./routes/earthquake/ceic"));

// 小说
router.get("/novel/biquge/:id", lazyRequire("./routes/novel/biquge"));
router.get("/novel/biqugeinfo/:id/:limit?", lazyRequire("./routes/novel/biqugeinfo"));
router.get("/novel/uukanshu/:uid", lazyRequire("./routes/novel/uukanshu"));
router.get("/novel/wenxuemi/:id1/:id2", lazyRequire("./routes/novel/wenxuemi"));
router.get("/novel/booksky/:id", lazyRequire("./routes/novel/booksky"));
router.get("/novel/shuquge/:id", lazyRequire("./routes/novel/shuquge"));
router.get("/novel/ptwxz/:id1/:id2", lazyRequire("./routes/novel/ptwxz"));
router.get("/novel/zhaishuyuan/:id", lazyRequire("./routes/novel/zhaishuyuan"));

// 中国气象网
router.get("/weatheralarm/:province?", lazyRequire("./routes/weatheralarm"));

// Gitlab
router.get("/gitlab/explore/:type", lazyRequire("./routes/gitlab/explore"));

// 忧郁的loli
router.get("/mygalgame", lazyRequire("./routes/galgame/hhgal")); // 废弃
router.get("/mmgal", lazyRequire("./routes/galgame/hhgal")); // 废弃
router.get("/hhgal", lazyRequire("./routes/galgame/hhgal"));

// say花火
router.get("/sayhuahuo", lazyRequire("./routes/galgame/sayhuahuo"));

// 终点分享
router.get("/zdfx", lazyRequire("./routes/galgame/zdfx"));

// 北京林业大学
router.get("/bjfu/grs", lazyRequire("./routes/universities/bjfu/grs"));
router.get("/bjfu/kjc", lazyRequire("./routes/universities/bjfu/kjc"));
router.get("/bjfu/jwc/:type", lazyRequire("./routes/universities/bjfu/jwc/index"));
router.get("/bjfu/news/:type", lazyRequire("./routes/universities/bjfu/news/index"));

// 北京理工大学
router.get("/bit/jwc", lazyRequire("./routes/universities/bit/jwc/jwc"));
router.get("/bit/cs", lazyRequire("./routes/universities/bit/cs/cs"));

// 大连工业大学
router.get("/dpu/jiaowu/news/:type?", lazyRequire("./routes/universities/dpu/jiaowu/news"));
router.get("/dpu/wlfw/news/:type?", lazyRequire("./routes/universities/dpu/wlfw/news"));

// 东南大学
router.get("/seu/radio/academic", lazyRequire("./routes/universities/seu/radio/academic"));
router.get("/seu/yzb/:type", lazyRequire("./routes/universities/seu/yzb"));
router.get("/seu/cse/:type?", lazyRequire("./routes/universities/seu/cse"));

// 南京工业大学
router.get("/njtech/jwc", lazyRequire("./routes/universities/njtech/jwc"));

// 南京航空航天大学
router.get("/nuaa/jwc/:type?", lazyRequire("./routes/universities/nuaa/jwc/jwc"));
router.get("/nuaa/cs/:type?", lazyRequire("./routes/universities/nuaa/cs/index"));
router.get("/nuaa/yjsy/:type?", lazyRequire("./routes/universities/nuaa/yjsy/yjsy"));

// 河海大学
router.get("/hhu/libNews", lazyRequire("./routes/universities/hhu/libNews"));
// 河海大学常州校区
router.get("/hhu/libNewsc", lazyRequire("./routes/universities/hhu/libNewsc"));

// 哈尔滨工业大学
router.get("/hit/jwc", lazyRequire("./routes/universities/hit/jwc"));
router.get("/hit/today/:category", lazyRequire("./routes/universities/hit/today"));

// 哈尔滨工业大学（威海）
router.get("/hitwh/today", lazyRequire("./routes/universities/hitwh/today"));

// 上海科技大学
router.get("/shanghaitech/activity", lazyRequire("./routes/universities/shanghaitech/activity"));
router.get("/shanghaitech/sist/activity", lazyRequire("./routes/universities/shanghaitech/sist/activity"));

// 上海交通大学
router.get("/sjtu/seiee/academic", lazyRequire("./routes/universities/sjtu/seiee/academic"));
router.get("/sjtu/seiee/bjwb/:type", lazyRequire("./routes/universities/sjtu/seiee/bjwb"));
router.get("/sjtu/seiee/xsb/:type?", lazyRequire("./routes/universities/sjtu/seiee/xsb"));

router.get("/sjtu/gs/tzgg/:type?", lazyRequire("./routes/universities/sjtu/gs/tzgg"));
router.get("/sjtu/jwc/:type?", lazyRequire("./routes/universities/sjtu/jwc"));
router.get("/sjtu/tongqu/:type?", lazyRequire("./routes/universities/sjtu/tongqu/activity"));
router.get("/sjtu/yzb/zkxx/:type", lazyRequire("./routes/universities/sjtu/yzb/zkxx"));

// 江南大学
router.get("/ju/jwc/:type?", lazyRequire("./routes/universities/ju/jwc"));

// 洛阳理工学院
router.get("/lit/jwc", lazyRequire("./routes/universities/lit/jwc"));
router.get("/lit/xwzx/:name?", lazyRequire("./routes/universities/lit/xwzx"));
router.get("/lit/tw/:name?", lazyRequire("./routes/universities/lit/tw"));

// 清华大学
router.get("/thu/career", lazyRequire("./routes/universities/thu/career"));
router.get("/thu/:type", lazyRequire("./routes/universities/thu/index"));

// 北京大学
router.get("/pku/eecs/:type?", lazyRequire("./routes/universities/pku/eecs"));
router.get("/pku/rccp/mzyt", lazyRequire("./routes/universities/pku/rccp/mzyt"));
router.get("/pku/cls/lecture", lazyRequire("./routes/universities/pku/cls/lecture"));
router.get("/pku/bbs/hot", lazyRequire("./routes/universities/pku/bbs/hot"));

// 上海海事大学
router.get("/shmtu/www/:type", lazyRequire("./routes/universities/shmtu/www"));
router.get("/shmtu/jwc/:type", lazyRequire("./routes/universities/shmtu/jwc"));

// 上海海洋大学
router.get("/shou/www/:type", lazyRequire("./routes/universities/shou/www"));

// 西南科技大学
router.get("/swust/jwc/news", lazyRequire("./routes/universities/swust/jwc_news"));
router.get("/swust/jwc/notice/:type?", lazyRequire("./routes/universities/swust/jwc_notice"));
router.get("/swust/cs/:type?", lazyRequire("./routes/universities/swust/cs"));

// 华南师范大学
router.get("/scnu/jw", lazyRequire("./routes/universities/scnu/jw"));
router.get("/scnu/library", lazyRequire("./routes/universities/scnu/library"));
router.get("/scnu/cs/match", lazyRequire("./routes/universities/scnu/cs/match"));

// 广东工业大学
router.get("/gdut/news", lazyRequire("./routes/universities/gdut/news"));

// 中国科学院
router.get("/cas/sim/academic", lazyRequire("./routes/universities/cas/sim/academic"));
router.get("/cas/mesalab/kb", lazyRequire("./routes/universities/cas/mesalab/kb"));
router.get("/cas/iee/kydt", lazyRequire("./routes/universities/cas/iee/kydt"));
router.get("/cas/cg/:caty?", lazyRequire("./routes/universities/cas/cg/index"));

// 中国传媒大学
router.get("/cuc/yz", lazyRequire("./routes/universities/cuc/yz"));

// 中国科学技术大学
router.get("/ustc/news/:type?", lazyRequire("./routes/universities/ustc/index"));
router.get("/ustc/jwc/:type?", lazyRequire("./routes/universities/ustc/jwc/index"));

// 南京邮电大学
router.get("/njupt/jwc/:type?", lazyRequire("./routes/universities/njupt/jwc"));

// 南昌航空大学
router.get("/nchu/jwc/:type?", lazyRequire("./routes/universities/nchu/jwc"));

// 哈尔滨工程大学
router.get("/heu/ugs/news/:author?/:category?", lazyRequire("./routes/universities/heu/ugs/news"));
router.get("/heu/yjsy/:type?", lazyRequire("./routes/universities/heu/yjsy"));
router.get("/heu/gongxue/:type?", lazyRequire("./routes/universities/heu/news"));
router.get("/heu/news/:type?", lazyRequire("./routes/universities/heu/news"));
router.get("/heu/shuisheng/:type?", lazyRequire("./routes/universities/heu/uae"));
router.get("/heu/uae/:type?", lazyRequire("./routes/universities/heu/uae"));
router.get("/heu/job/:type?", lazyRequire("./routes/universities/heu/job"));

// 重庆大学
router.get("/cqu/jwc/announcement", lazyRequire("./routes/universities/cqu/jwc/announcement"));
router.get("/cqu/news/jzyg", lazyRequire("./routes/universities/cqu/news/jzyg"));
router.get("/cqu/news/tz", lazyRequire("./routes/universities/cqu/news/tz"));
router.get("/cqu/youth/:category", lazyRequire("./routes/universities/cqu/youth/info"));
router.get("/cqu/sci/:category", lazyRequire("./routes/universities/cqu/sci/info"));
router.get("/cqu/net/:category", lazyRequire("./routes/universities/cqu/net/info"));

// 南京信息工程大学
router.get("/nuist/bulletin/:category?", lazyRequire("./routes/universities/nuist/bulletin"));
router.get("/nuist/jwc/:category?", lazyRequire("./routes/universities/nuist/jwc"));
router.get("/nuist/yjs/:category?", lazyRequire("./routes/universities/nuist/yjs"));
router.get("/nuist/xgc", lazyRequire("./routes/universities/nuist/xgc"));
router.get("/nuist/scs/:category?", lazyRequire("./routes/universities/nuist/scs"));
router.get("/nuist/lib", lazyRequire("./routes/universities/nuist/library/lib"));
router.get("/nuist/sese/:category?", lazyRequire("./routes/universities/nuist/sese"));
router.get("/nuist/cas/:category?", lazyRequire("./routes/universities/nuist/cas"));

// 成都信息工程大学
router.get("/cuit/cxxww/:type?", lazyRequire("./routes/universities/cuit/cxxww"));

// 郑州大学
router.get("/zzu/news/:type", lazyRequire("./routes/universities/zzu/news"));
router.get("/zzu/soft/news/:type", lazyRequire("./routes/universities/zzu/soft/news"));

// 郑州轻工业大学
router.get("/zzuli/campus/:type", lazyRequire("./routes/universities/zzuli/campus"));
router.get("/zzuli/yjsc/:type", lazyRequire("./routes/universities/zzuli/yjsc"));

// 重庆科技学院
router.get("/cqust/jw/:type?", lazyRequire("./routes/universities/cqust/jw"));
router.get("/cqust/lib/:type?", lazyRequire("./routes/universities/cqust/lib"));

// 常州大学
router.get("/cczu/jwc/:category?", lazyRequire("./routes/universities/cczu/jwc"));
router.get("/cczu/news/:category?", lazyRequire("./routes/universities/cczu/news"));

// 南京理工大学
router.get("/njust/jwc/:type", lazyRequire("./routes/universities/njust/jwc"));
router.get("/njust/cwc/:type", lazyRequire("./routes/universities/njust/cwc"));
router.get("/njust/gs/:type", lazyRequire("./routes/universities/njust/gs"));
router.get("/njust/eo/:grade?/:type?", lazyRequire("./routes/universities/njust/eo"));

// 四川旅游学院
router.get("/sctu/xgxy", lazyRequire("./routes/universities/sctu/information-engineer-faculty/index"));
router.get("/sctu/xgxy/:id", lazyRequire("./routes/universities/sctu/information-engineer-faculty/context"));
router.get("/sctu/jwc/:type?", lazyRequire("./routes/universities/sctu/jwc/index"));
router.get("/sctu/jwc/:type/:id", lazyRequire("./routes/universities/sctu/jwc/context"));

// 电子科技大学
router.get("/uestc/jwc/:type?", lazyRequire("./routes/universities/uestc/jwc"));
router.get("/uestc/news/:type?", lazyRequire("./routes/universities/uestc/news"));
router.get("/uestc/auto/:type?", lazyRequire("./routes/universities/uestc/auto"));
router.get("/uestc/cs/:type?", lazyRequire("./routes/universities/uestc/cs"));
router.get("/uestc/cqe/:type?", lazyRequire("./routes/universities/uestc/cqe"));

// 云南大学
router.get("/ynu/grs/zytz", lazyRequire("./routes/universities/ynu/grs/zytz"));
router.get("/ynu/grs/qttz/:category", lazyRequire("./routes/universities/ynu/grs/qttz"));
router.get("/ynu/jwc/:category", lazyRequire("./routes/universities/ynu/jwc/zytz"));
router.get("/ynu/home", lazyRequire("./routes/universities/ynu/home/main"));

// 昆明理工大学
router.get("/kmust/jwc/:type?", lazyRequire("./routes/universities/kmust/jwc"));
router.get("/kmust/job/careers/:type?", lazyRequire("./routes/universities/kmust/job/careers"));
router.get("/kmust/job/jobfairs", lazyRequire("./routes/universities/kmust/job/jobfairs"));

// 武汉大学
router.get("/whu/cs/:type", lazyRequire("./routes/universities/whu/cs"));
router.get("/whu/news/:type?", lazyRequire("./routes/universities/whu/news"));

// 华中科技大学
router.get("/hust/auto/notice/:type?", lazyRequire("./routes/universities/hust/aia/notice"));
router.get("/hust/auto/news", lazyRequire("./routes/universities/hust/aia/news"));
router.get("/hust/aia/news", lazyRequire("./routes/universities/hust/aia/news"));
router.get("/hust/aia/notice/:type?", lazyRequire("./routes/universities/hust/aia/notice"));

// 井冈山大学
router.get("/jgsu/jwc", lazyRequire("./routes/universities/jgsu/jwc"));

// 中南大学
router.get("/csu/job/:type?", lazyRequire("./routes/universities/csu/job"));

// 山东大学
router.get("/sdu/sc/:type?", lazyRequire("./routes/universities/sdu/sc"));
router.get("/sdu/cs/:type?", lazyRequire("./routes/universities/sdu/cs"));
router.get("/sdu/cmse/:type?", lazyRequire("./routes/universities/sdu/cmse"));
router.get("/sdu/mech/:type?", lazyRequire("./routes/universities/sdu/mech"));
router.get("/sdu/epe/:type?", lazyRequire("./routes/universities/sdu/epe"));

// 中国海洋大学
router.get("/ouc/it/:type?", lazyRequire("./routes/universities/ouc/it"));

// 大连大学
router.get("/dlu/jiaowu/news", lazyRequire("./routes/universities/dlu/jiaowu/news"));

// 东莞理工学院
router.get("/dgut/jwc/:type?", lazyRequire("./routes/universities/dgut/jwc"));
router.get("/dgut/xsc/:type?", lazyRequire("./routes/universities/dgut/xsc"));

// 同济大学
router.get("/tju/sse/:type?", lazyRequire("./routes/universities/tju/sse/notice"));

// 华南理工大学
router.get("/scut/jwc/notice/:category?", lazyRequire("./routes/universities/scut/jwc/notice"));
router.get("/scut/jwc/news", lazyRequire("./routes/universities/scut/jwc/news"));

// 温州商学院
router.get("/wzbc/:type?", lazyRequire("./routes/universities/wzbc/news"));

// 河南大学
router.get("/henu/:type?", lazyRequire("./routes/universities/henu/news"));

// 天津大学
router.get("/tjpyu/ooa/:type?", lazyRequire("./routes/universities/tjpyu/ooa"));

// 南开大学
router.get("/nku/jwc/:type?", lazyRequire("./routes/universities/nku/jwc/index"));

// 北京航空航天大学
router.get("/buaa/news/:type", lazyRequire("./routes/universities/buaa/news/index"));

// 浙江工业大学
router.get("/zjut/:type", lazyRequire("./routes/universities/zjut/index"));
router.get("/zjut/design/:type", lazyRequire("./routes/universities/zjut/design"));

// 上海大学
router.get("/shu/jwc/:type?", lazyRequire("./routes/universities/shu/jwc"));

// 北京科技大学天津学院
router.get("/ustb/tj/news/:type?", lazyRequire("./routes/universities/ustb/tj/news"));

// 深圳大学
router.get("/szu/yz/:type?", lazyRequire("./routes/universities/szu/yz"));

// 中国石油大学（华东）
router.get("/upc/main/:type?", lazyRequire("./routes/universities/upc/main"));
router.get("/upc/jsj/:type?", lazyRequire("./routes/universities/upc/jsj"));

// 华北水利水电大学
router.get("/ncwu/notice", lazyRequire("./routes/universities/ncwu/notice"));

// 太原师范学院
router.get("/tynu", lazyRequire("./routes/universities/tynu/tynu"));

// 中北大学
router.get("/nuc/:type", lazyRequire("./routes/universities/nuc/index"));

// 安徽农业大学
router.get("/ahau/cs_news/:type", lazyRequire("./routes/universities/ahau/cs_news/index"));
router.get("/ahau/jwc/:type", lazyRequire("./routes/universities/ahau/jwc/index"));
router.get("/ahau/main/:type", lazyRequire("./routes/universities/ahau/main/index"));

// 安徽医科大学研究生学院
router.get("/ahmu/news", lazyRequire("./routes/universities/ahmu/news"));

// 安徽工业大学
router.get("/ahut/news", lazyRequire("./routes/universities/ahut/news"));
router.get("/ahut/jwc", lazyRequire("./routes/universities/ahut/jwc"));
router.get("/ahut/cstzgg", lazyRequire("./routes/universities/ahut/cstzgg"));

// 上海理工大学
router.get("/usst/jwc", lazyRequire("./routes/universities/usst/jwc"));

// 临沂大学
router.get("/lyu/news/:type", lazyRequire("./routes/universities/lyu/news/index"));

// ifanr
router.get("/ifanr/:channel?", lazyRequire("./routes/ifanr/index"));

// 果壳网
router.get("/guokr/scientific", lazyRequire("./routes/guokr/scientific"));
router.get("/guokr/:channel", lazyRequire("./routes/guokr/calendar"));

// 联合早报
router.get("/zaobao/realtime/:section?", lazyRequire("./routes/zaobao/realtime"));
router.get("/zaobao/znews/:section?", lazyRequire("./routes/zaobao/znews"));
router.get("/zaobao/:type/:section", lazyRequire("./routes/zaobao/index"));

// Apple
router.get("/apple/exchange_repair/:country?", lazyRequire("./routes/apple/exchange_repair"));

// IPSW.me
router.get("/ipsw/index/:ptype/:pname", lazyRequire("./routes/ipsw/index"));

// Minecraft CurseForge
router.get("/curseforge/files/:project", lazyRequire("./routes/curseforge/files"));

// 少数派 sspai
router.get("/sspai/series", lazyRequire("./routes/sspai/series"));
router.get("/sspai/shortcuts", lazyRequire("./routes/sspai/shortcutsGallery"));
router.get("/sspai/matrix", lazyRequire("./routes/sspai/matrix"));
router.get("/sspai/column/:id", lazyRequire("./routes/sspai/column"));
router.get("/sspai/author/:id", lazyRequire("./routes/sspai/author"));
router.get("/sspai/topics", lazyRequire("./routes/sspai/topics"));
router.get("/sspai/topic/:id", lazyRequire("./routes/sspai/topic"));
router.get("/sspai/tag/:keyword", lazyRequire("./routes/sspai/tag"));
router.get("/sspai/activity/:slug", lazyRequire("./routes/sspai/activity"));

// 异次元软件世界
router.get("/iplay/home", lazyRequire("./routes/iplay/home"));

// xclient.info
router.get("/xclient/app/:name", lazyRequire("./routes/xclient/app"));

// 中国驻外使领事馆
router.get("/embassy/:country/:city?", lazyRequire("./routes/embassy/index"));

// 澎湃新闻
router.get("/thepaper/featured", lazyRequire("./routes/thepaper/featured"));
router.get("/thepaper/channel/:id", lazyRequire("./routes/thepaper/channel"));
router.get("/thepaper/list/:id", lazyRequire("./routes/thepaper/list"));

// 澎湃美数课
router.get("/thepaper/839studio", lazyRequire("./routes/thepaper/839studio/studio.js"));
router.get("/thepaper/839studio/:id", lazyRequire("./routes/thepaper/839studio/category.js"));

// 电影首发站
router.get("/dysfz", lazyRequire("./routes/dysfz/index"));
router.get("/dysfz/index", lazyRequire("./routes/dysfz/index")); // 废弃

// きららファンタジア
router.get("/kirara/news", lazyRequire("./routes/kirara/news"));

// 电影天堂
router.get("/dytt", lazyRequire("./routes/dytt/index"));
router.get("/dytt/index", lazyRequire("./routes/dytt/index")); // 废弃

// BT之家
router.get("/btzj/:type?", lazyRequire("./routes/btzj/index"));

// 人生05电影网
router.get("/rs05/rs05", lazyRequire("./routes/rs05/rs05"));

// 人人影视 (评测推荐)
router.get("/rrys/review", lazyRequire("./routes/rrys/review"));

// 人人影视（每日更新）
router.get("/yyets/todayfilelist", lazyRequire("./routes/yyets/todayfilelist"));

// 趣头条
router.get("/qutoutiao/category/:cid", lazyRequire("./routes/qutoutiao/category"));

// NHK NEW WEB EASY
router.get("/nhk/news_web_easy", lazyRequire("./routes/nhk/news_web_easy"));

// BBC
router.get("/bbc/:site?/:channel?", lazyRequire("./routes/bbc/index"));

// FT 中文网
router.get("/ft/:language/:channel?", lazyRequire("./routes/ft/channel"));

// The Verge
router.get("/verge", lazyRequire("./routes/verge/index"));

// 看雪
router.get("/pediy/topic/:category?/:type?", lazyRequire("./routes/pediy/topic"));

// 多维新闻网
router.get("/dwnews/yaowen/:region?", lazyRequire("./routes/dwnews/yaowen"));
router.get("/dwnews/rank/:type?/:range?", lazyRequire("./routes/dwnews/rank"));

// 知晓程序
router.get("/miniapp/article/:category", lazyRequire("./routes/miniapp/article"));
router.get("/miniapp/store/newest", lazyRequire("./routes/miniapp/store/newest"));

// 后续
router.get("/houxu/live/:id/:timeline?", lazyRequire("./routes/houxu/live"));
router.get("/houxu/events", lazyRequire("./routes/houxu/events"));
router.get("/houxu/lives/:type", lazyRequire("./routes/houxu/lives"));

// 老司机
router.get("/laosiji/hot", lazyRequire("./routes/laosiji/hot"));
router.get("/laosiji/feed", lazyRequire("./routes/laosiji/feed"));
router.get("/laosiji/hotshow/:id", lazyRequire("./routes/laosiji/hotshow"));

// Scientific American 60-Second Science
router.get("/60s-science/transcript", lazyRequire("./routes/60s-science/transcript"));

// 99% Invisible
router.get("/99percentinvisible/transcript", lazyRequire("./routes/99percentinvisible/transcript"));

// 青空文庫
router.get("/aozora/newbook/:count?", lazyRequire("./routes/aozora/newbook"));

// solidot
router.get("/solidot/:type?", lazyRequire("./routes/solidot/main"));

// Hermes UK
router.get("/parcel/hermesuk/:tracking", lazyRequire("./routes/parcel/hermesuk"));

// 数字尾巴
router.get("/dgtle", lazyRequire("./routes/dgtle/index"));
router.get("/dgtle/whale/category/:category", lazyRequire("./routes/dgtle/whale"));
router.get("/dgtle/whale/rank/:type/:rule", lazyRequire("./routes/dgtle/whale_rank"));
router.get("/dgtle/trade/:typeId?", lazyRequire("./routes/dgtle/trade"));
router.get("/dgtle/trade/search/:keyword", lazyRequire("./routes/dgtle/keyword"));

// 抽屉新热榜
router.get("/chouti/top/:hour?", lazyRequire("./routes/chouti/top"));
router.get("/chouti/:subject?", lazyRequire("./routes/chouti"));

// 西安电子科技大学
router.get("/xidian/jwc/:category?", lazyRequire("./routes/universities/xidian/jwc"));

// Westore
router.get("/westore/new", lazyRequire("./routes/westore/new"));

// 优酷
router.get("/youku/channel/:channelId/:embed?", lazyRequire("./routes/youku/channel"));

// 油价
router.get("/oilprice/:area", lazyRequire("./routes/oilprice"));

// 龙腾网
router.get("/ltaaa/:type?", lazyRequire("./routes/ltaaa/main"));

// AcFun
router.get("/acfun/bangumi/:id", lazyRequire("./routes/acfun/bangumi"));
router.get("/acfun/user/video/:uid", lazyRequire("./routes/acfun/video"));

// Auto Trader
router.get("/autotrader/:query", lazyRequire("./routes/autotrader"));

// 极客公园
router.get("/geekpark/breakingnews", lazyRequire("./routes/geekpark/breakingnews"));

// 百度
router.get("/baidu/doodles", lazyRequire("./routes/baidu/doodles"));
router.get("/baidu/topwords/:boardId?", lazyRequire("./routes/baidu/topwords"));
router.get("/baidu/daily", lazyRequire("./routes/baidu/daily"));

// 搜狗
router.get("/sogou/doodles", lazyRequire("./routes/sogou/doodles"));

// 香港天文台
router.get("/hko/weather", lazyRequire("./routes/hko/weather"));

// sankakucomplex
router.get("/sankakucomplex/post", lazyRequire("./routes/sankakucomplex/post"));

// 技术头条
router.get("/blogread/newest", lazyRequire("./routes/blogread/newest"));

// gnn游戏新闻
router.get("/gnn/gnn", lazyRequire("./routes/gnn/gnn"));

// a9vg游戏新闻
router.get("/a9vg/a9vg", lazyRequire("./routes/a9vg/a9vg"));

// IT桔子
router.get("/itjuzi/invest", lazyRequire("./routes/itjuzi/invest"));
router.get("/itjuzi/merge", lazyRequire("./routes/itjuzi/merge"));

// 探物
router.get("/tanwu/products", lazyRequire("./routes/tanwu/products"));

// GitChat
router.get("/gitchat/newest/:category?/:selected?", lazyRequire("./routes/gitchat/newest"));

// The Guardian
router.get("/guardian/:type", lazyRequire("./routes/guardian/guardian"));

// 下厨房
router.get("/xiachufang/user/cooked/:id", lazyRequire("./routes/xiachufang/user/cooked"));
router.get("/xiachufang/user/created/:id", lazyRequire("./routes/xiachufang/user/created"));
router.get("/xiachufang/popular/:timeframe?", lazyRequire("./routes/xiachufang/popular"));

// 经济观察报
router.get("/eeo/:category?", lazyRequire("./routes/eeo/index"));

// 腾讯视频
router.get("/tencentvideo/playlist/:id", lazyRequire("./routes/tencent/video/playlist"));

// 看漫画
router.get("/manhuagui/comic/:id", lazyRequire("./routes/manhuagui/comic"));
// 動漫狂
router.get("/cartoonmad/comic/:id", lazyRequire("./routes/cartoonmad/comic"));
// Vol
router.get("/vol/:mode?", lazyRequire("./routes/vol/lastupdate"));
// 咚漫
router.get("/dongmanmanhua/:category/:name/:id", lazyRequire("./routes/dongmanmanhua/comic"));
// webtoons
router.get("/webtoons/:lang/:category/:name/:id", lazyRequire("./routes/webtoons/comic"));
router.get("/webtoons/naver/:id", lazyRequire("./routes/webtoons/naver"));

// Tits Guru
router.get("/tits-guru/home", lazyRequire("./routes/titsguru/home"));
router.get("/tits-guru/daily", lazyRequire("./routes/titsguru/daily"));
router.get("/tits-guru/category/:type", lazyRequire("./routes/titsguru/category"));
router.get("/tits-guru/model/:name", lazyRequire("./routes/titsguru/model"));

// typora
router.get("/typora/changelog", lazyRequire("./routes/typora/changelog"));
router.get("/typora/changelog-dev/:os?", lazyRequire("./routes/typora/changelog-dev"));

// TSSstatus
router.get("/tssstatus/:board/:build", lazyRequire("./routes/tssstatus"));

// Anime1
router.get("/anime1/anime/:time/:name", lazyRequire("./routes/anime1/anime"));
router.get("/anime1/search/:keyword", lazyRequire("./routes/anime1/search"));

// gitea
router.get("/gitea/blog", lazyRequire("./routes/gitea/blog"));

// iDownloadBlog
router.get("/idownloadblog", lazyRequire("./routes/idownloadblog/index"));

// 9to5
router.get("/9to5/:subsite/:tag?", lazyRequire("./routes/9to5/subsite"));

// TesterHome
router.get("/testerhome/newest", lazyRequire("./routes/testerhome/newest"));

// 刷屏
router.get("/weseepro/newest", lazyRequire("./routes/weseepro/newest"));
router.get("/weseepro/newest-direct", lazyRequire("./routes/weseepro/newest-direct"));
router.get("/weseepro/circle", lazyRequire("./routes/weseepro/circle"));

// 玩物志
router.get("/coolbuy/newest", lazyRequire("./routes/coolbuy/newest"));

// NGA
router.get("/nga/forum/:fid/:recommend?", lazyRequire("./routes/nga/forum"));
router.get("/nga/post/:tid", lazyRequire("./routes/nga/post"));

// Nautilus
router.get("/nautilus/topic/:tid", lazyRequire("./routes/nautilus/topics"));

// JavBus
router.get("/javbus/home", lazyRequire("./routes/javbus/home"));
router.get("/javbus/genre/:gid", lazyRequire("./routes/javbus/genre"));
router.get("/javbus/star/:sid", lazyRequire("./routes/javbus/star"));
router.get("/javbus/series/:seriesid", lazyRequire("./routes/javbus/series"));
router.get("/javbus/uncensored/home", lazyRequire("./routes/javbus/uncensored/home"));
router.get("/javbus/uncensored/genre/:gid", lazyRequire("./routes/javbus/uncensored/genre"));
router.get("/javbus/uncensored/star/:sid", lazyRequire("./routes/javbus/uncensored/star"));
router.get("/javbus/uncensored/series/:seriesid", lazyRequire("./routes/javbus/uncensored/series"));
router.get("/javbus/western/home", lazyRequire("./routes/javbus/western/home"));
router.get("/javbus/western/genre/:gid", lazyRequire("./routes/javbus/western/genre"));
router.get("/javbus/western/star/:sid", lazyRequire("./routes/javbus/western/star"));
router.get("/javbus/western/series/:seriesid", lazyRequire("./routes/javbus/western/series"));

// 中山大学
router.get("/sysu/sdcs", lazyRequire("./routes/universities/sysu/sdcs"));

// 動畫瘋
router.get("/anigamer/new_anime", lazyRequire("./routes/anigamer/new_anime"));
router.get("/anigamer/anime/:sn", lazyRequire("./routes/anigamer/anime"));

// Apkpure
router.get("/apkpure/versions/:region/:pkg", lazyRequire("./routes/apkpure/versions"));

// 豆瓣美女
router.get("/dbmv/:category?", lazyRequire("./routes/dbmv/index"));

// 中国药科大学
router.get("/cpu/home", lazyRequire("./routes/universities/cpu/home"));
router.get("/cpu/jwc", lazyRequire("./routes/universities/cpu/jwc"));
router.get("/cpu/yjsy", lazyRequire("./routes/universities/cpu/yjsy"));

// 字幕组
router.get("/zimuzu/resource/:id?", lazyRequire("./routes/zimuzu/resource"));
router.get("/zimuzu/top/:range/:type", lazyRequire("./routes/zimuzu/top"));

// 虎嗅
router.get("/huxiu/tag/:id", lazyRequire("./routes/huxiu/tag"));
router.get("/huxiu/search/:keyword", lazyRequire("./routes/huxiu/search"));
router.get("/huxiu/author/:id", lazyRequire("./routes/huxiu/author"));
router.get("/huxiu/article", lazyRequire("./routes/huxiu/article"));
router.get("/huxiu/collection/:id", lazyRequire("./routes/huxiu/collection"));

// Steam
router.get("/steam/search/:params", lazyRequire("./routes/steam/search"));
router.get("/steam/news/:appids", lazyRequire("./routes/steam/news"));

// Steamgifts
router.get("/steamgifts/discussions/:category?", lazyRequire("./routes/steam/steamgifts/discussions"));

// 扇贝
router.get("/shanbay/checkin/:id", lazyRequire("./routes/shanbay/checkin"));
router.get("/shanbay/footprints/:category?", lazyRequire("./routes/shanbay/footprints"));

// Facebook
router.get("/facebook/page/:id", lazyRequire("./routes/facebook/page"));

// 币乎
router.get("/bihu/activaties/:id", lazyRequire("./routes/bihu/activaties"));

// 停电通知
router.get("/tingdiantz/nanjing", lazyRequire("./routes/tingdiantz/nanjing"));

// 36kr
router.get("/36kr/search/article/:keyword", lazyRequire("./routes/36kr/search/article"));
router.get("/36kr/newsflashes", lazyRequire("./routes/36kr/newsflashes"));
router.get("/36kr/user/:uid", lazyRequire("./routes/36kr/user"));
router.get("/36kr/motif/:mid", lazyRequire("./routes/36kr/motif"));

// PMCAFF
router.get("/pmcaff/list/:typeid", lazyRequire("./routes/pmcaff/list"));
router.get("/pmcaff/feed/:typeid", lazyRequire("./routes/pmcaff/feed"));
router.get("/pmcaff/user/:userid", lazyRequire("./routes/pmcaff/user"));

// icourse163
router.get("/icourse163/newest", lazyRequire("./routes/icourse163/newest"));

// patchwork.kernel.org
router.get("/patchwork.kernel.org/comments/:id", lazyRequire("./routes/patchwork.kernel.org/comments"));

// 京东众筹
router.get("/jingdong/zhongchou/:type/:status/:sort", lazyRequire("./routes/jingdong/zhongchou"));

// 淘宝众筹
router.get("/taobao/zhongchou/:type?", lazyRequire("./routes/taobao/zhongchou"));

// All Poetry
router.get("/allpoetry/:order?", lazyRequire("./routes/allpoetry/order"));

// 华尔街见闻
router.get("/wallstreetcn/news/global", lazyRequire("./routes/wallstreetcn/news"));
router.get("/wallstreetcn/live/:channel?", lazyRequire("./routes/wallstreetcn/live"));

// 多抓鱼搜索
router.get("/duozhuayu/search/:wd", lazyRequire("./routes/duozhuayu/search"));

// 创业邦
router.get("/cyzone/author/:id", lazyRequire("./routes/cyzone/author"));
router.get("/cyzone/label/:name", lazyRequire("./routes/cyzone/label"));

// 政府
router.get("/gov/zhengce/zuixin", lazyRequire("./routes/gov/zhengce/zuixin"));
router.get("/gov/zhengce/wenjian/:pcodeJiguan?", lazyRequire("./routes/gov/zhengce/wenjian"));
router.get("/gov/zhengce/govall/:advance?", lazyRequire("./routes/gov/zhengce/govall"));
router.get("/gov/province/:name/:category", lazyRequire("./routes/gov/province"));
router.get("/gov/city/:name/:category", lazyRequire("./routes/gov/city"));
router.get("/gov/statecouncil/briefing", lazyRequire("./routes/gov/statecouncil/briefing"));
router.get("/gov/news/:uid", lazyRequire("./routes/gov/news"));
router.get("/gov/shuju/:caty/:item", lazyRequire("./routes/gov/shuju"));
router.get("/gov/xinwen/tujie/:caty", lazyRequire("./routes/gov/xinwen/tujie"));

// 苏州
router.get("/gov/suzhou/news/:uid", lazyRequire("./routes/gov/suzhou/news"));
router.get("/gov/suzhou/doc", lazyRequire("./routes/gov/suzhou/doc"));

// 江苏
router.get("/gov/jiangsu/eea/:type?", lazyRequire("./routes/gov/jiangsu/eea"));

// 山西
router.get("/gov/shanxi/rst/:category", lazyRequire("./routes/gov/shanxi/rst"));

// 湖南
router.get("/gov/hunan/notice/:type", lazyRequire("./routes/gov/hunan/notice"));

// 中华人民共和国-海关总署
router.get("/gov/customs/list/:gchannel", lazyRequire("./routes/gov/customs/list"));

// 中华人民共和国生态环境部
router.get("/gov/mee/gs", lazyRequire("./routes/gov/mee/gs"));

// 中华人民共和国教育部
router.get("/gov/moe/:type", lazyRequire("./routes/gov/moe/moe"));

// 中华人民共和国外交部
router.get("/gov/fmprc/fyrbt", lazyRequire("./routes/gov/fmprc/fyrbt"));

// 中华人民共和国住房和城乡建设部
router.get("/gov/mohurd/policy", lazyRequire("./routes/gov/mohurd/policy"));

// 国家新闻出版广电总局
router.get("/gov/sapprft/approval/:channel/:detail?", lazyRequire("./routes/gov/sapprft/7026"));

// 国家新闻出版署
router.get("/gov/nppa/:channel", lazyRequire("./routes/gov/nppa/channels"));
router.get("/gov/nppa/:channel/:content", lazyRequire("./routes/gov/nppa/contents"));

// 北京卫生健康委员会
router.get("/gov/beijing/mhc/:caty", lazyRequire("./routes/gov/beijing/mhc"));

// 北京考试院
router.get("/gov/beijing/bjeea/:type", lazyRequire("./routes/gov/beijing/eea"));

// 广东省教育厅
router.get("/gov/guangdong/edu/:caty", lazyRequire("./routes/gov/guangdong/edu"));

// 日本国外務省記者会見
router.get("/go.jp/mofa", lazyRequire("./routes/go.jp/mofa/main"));

// 小黑盒
router.get("/xiaoheihe/user/:id", lazyRequire("./routes/xiaoheihe/user"));
router.get("/xiaoheihe/news", lazyRequire("./routes/xiaoheihe/news"));
router.get("/xiaoheihe/discount/:platform?", lazyRequire("./routes/xiaoheihe/discount"));

// 惠誉评级
router.get("/fitchratings/site/:type", lazyRequire("./routes/fitchratings/site"));

// 移动支付
router.get("/mpaypass/news", lazyRequire("./routes/mpaypass/news"));
router.get("/mpaypass/main/:type?", lazyRequire("./routes/mpaypass/main"));

// 新浪科技探索
router.get("/sina/discovery/:type", lazyRequire("./routes/sina/discovery"));

// 新浪科技滚动新闻
router.get("/sina/rollnews", lazyRequire("./routes/sina/rollnews"));

// 新浪专栏创事记
router.get("/sina/csj", lazyRequire("./routes/sina/chuangshiji"));

// 新浪财经－国內
router.get("/sina/finance", lazyRequire("./routes/sina/finance"));

// Animen
router.get("/animen/news/:type", lazyRequire("./routes/animen/news"));

// D2 资源库
router.get("/d2/daily", lazyRequire("./routes/d2/daily"));

// ebb
router.get("/ebb", lazyRequire("./routes/ebb"));

// Indienova
router.get("/indienova/:type", lazyRequire("./routes/indienova/article"));

// JPMorgan Chase Institute
router.get("/jpmorganchase", lazyRequire("./routes/jpmorganchase/research"));

// 美拍
router.get("/meipai/user/:uid", lazyRequire("./routes/meipai/user"));

// 多知网
router.get("/duozhi", lazyRequire("./routes/duozhi"));

// Docker Hub
router.get("/dockerhub/build/:owner/:image/:tag?", lazyRequire("./routes/dockerhub/build"));

// 人人都是产品经理
router.get("/woshipm/popular", lazyRequire("./routes/woshipm/popular"));
router.get("/woshipm/wen", lazyRequire("./routes/woshipm/wen"));
router.get("/woshipm/bookmarks/:id", lazyRequire("./routes/woshipm/bookmarks"));
router.get("/woshipm/user_article/:id", lazyRequire("./routes/woshipm/user_article"));
router.get("/woshipm/latest", lazyRequire("./routes/woshipm/latest"));

// 高清电台
router.get("/gaoqing/latest", lazyRequire("./routes/gaoqing/latest"));

// 轻小说文库
router.get("/wenku8/chapter/:id", lazyRequire("./routes/wenku8/chapter"));

// 鲸跃汽车
router.get("/whalegogo/home", lazyRequire("./routes/whalegogo/home"));
router.get("/whalegogo/portal/:type_id/:tagid?", lazyRequire("./routes/whalegogo/portal"));

// 爱思想
router.get("/aisixiang/column/:id", lazyRequire("./routes/aisixiang/column"));
router.get("/aisixiang/ranking/:type?/:range?", lazyRequire("./routes/aisixiang/ranking"));
router.get("/aisixiang/thinktank/:name/:type?", lazyRequire("./routes/aisixiang/thinktank"));

// Hacker News
router.get("/hackernews/:section/:type?", lazyRequire("./routes/hackernews/story"));

// LeetCode
router.get("/leetcode/articles", lazyRequire("./routes/leetcode/articles"));
router.get("/leetcode/submission/us/:user", lazyRequire("./routes/leetcode/check-us"));
router.get("/leetcode/submission/cn/:user", lazyRequire("./routes/leetcode/check-cn"));

// segmentfault
router.get("/segmentfault/channel/:name", lazyRequire("./routes/segmentfault/channel"));
router.get("/segmentfault/user/:name", lazyRequire("./routes/segmentfault/user"));

// 虎扑
router.get("/hupu/bxj/:id/:order?", lazyRequire("./routes/hupu/bbs"));
router.get("/hupu/bbs/:id/:order?", lazyRequire("./routes/hupu/bbs"));
router.get("/hupu/all/:caty", lazyRequire("./routes/hupu/all"));
router.get("/hupu/dept/:dept", lazyRequire("./routes/hupu/dept"));

// 牛客网
router.get("/nowcoder/discuss/:type/:order", lazyRequire("./routes/nowcoder/discuss"));
router.get("/nowcoder/schedule/:propertyId?/:typeId?", lazyRequire("./routes/nowcoder/schedule"));
router.get("/nowcoder/recommend", lazyRequire("./routes/nowcoder/recommend"));
router.get("/nowcoder/jobcenter/:recruitType?/:city?/:type?/:order?/:latest?", lazyRequire("./routes/nowcoder/jobcenter"));

// Xiaomi.eu
router.get("/xiaomieu/releases", lazyRequire("./routes/xiaomieu/releases"));

// sketch.com
router.get("/sketch/beta", lazyRequire("./routes/sketch/beta"));
router.get("/sketch/updates", lazyRequire("./routes/sketch/updates"));

// 每日安全
router.get("/security/pulses", lazyRequire("./routes/security/pulses"));

// DoNews
router.get("/donews/:column?", lazyRequire("./routes/donews/index"));

// WeGene
router.get("/wegene/column/:type/:category", lazyRequire("./routes/wegene/column"));
router.get("/wegene/newest", lazyRequire("./routes/wegene/newest"));

// instapaper
router.get("/instapaper/person/:name", lazyRequire("./routes/instapaper/person"));

// UI 中国
router.get("/ui-cn/article", lazyRequire("./routes/ui-cn/article"));
router.get("/ui-cn/user/:id", lazyRequire("./routes/ui-cn/user"));

// Dcard
router.get("/dcard/:section/:type?", lazyRequire("./routes/dcard/section"));

// 12306
router.get("/12306/zxdt/:id?", lazyRequire("./routes/12306/zxdt"));

// 北京天文馆每日一图
router.get("/bjp/apod", lazyRequire("./routes/bjp/apod"));

// 洛谷
router.get("/luogu/daily/:id?", lazyRequire("./routes/luogu/daily"));
router.get("/luogu/contest", lazyRequire("./routes/luogu/contest"));
router.get("/luogu/user/feed/:uid", lazyRequire("./routes/luogu/userFeed"));

// 决胜网
router.get("/juesheng", lazyRequire("./routes/juesheng"));

// 播客IBCラジオ イヤーマイッタマイッタ
router.get("/maitta", lazyRequire("./routes/maitta"));

// 一些博客
// 敬维-以认真的态度做完美的事情: https://jingwei.link/
router.get("/blogs/jingwei.link", lazyRequire("./routes/blogs/jingwei_link"));

// 王垠的博客-当然我在扯淡
router.get("/blogs/wangyin", lazyRequire("./routes/blogs/wangyin"));

// 王五四文集
router.get("/blogs/wang54/:id?", lazyRequire("./routes/blogs/wang54"));

// WordPress
router.get("/blogs/wordpress/:domain/:https?", lazyRequire("./routes/blogs/wordpress"));

// 裏垢女子まとめ
router.get("/uraaka-joshi", lazyRequire("./routes/uraaka-joshi/uraaka-joshi"));
router.get("/uraaka-joshi/:id", lazyRequire("./routes/uraaka-joshi/uraaka-joshi-user"));

// 西祠胡同
router.get("/xici/:id?", lazyRequire("./routes/xici"));

// 淘股吧论坛
router.get("/taoguba/index", lazyRequire("./routes/taoguba/index"));
router.get("/taoguba/user/:uid", lazyRequire("./routes/taoguba/user"));

// 今日热榜
router.get("/tophub/:id", lazyRequire("./routes/tophub"));

// 游戏时光
router.get("/vgtime/news", lazyRequire("./routes/vgtime/news.js"));
router.get("/vgtime/release", lazyRequire("./routes/vgtime/release"));
router.get("/vgtime/keyword/:keyword", lazyRequire("./routes/vgtime/keyword"));

// MP4吧
router.get("/mp4ba/:param", lazyRequire("./routes/mp4ba"));

// anitama
router.get("/anitama/:channel?", lazyRequire("./routes/anitama/channel"));

// 親子王國
router.get("/babykingdom/:id/:order?", lazyRequire("./routes/babykingdom"));

// 四川大学
router.get("/scu/jwc/notice", lazyRequire("./routes/universities/scu/jwc"));
router.get("/scu/xg/notice", lazyRequire("./routes/universities/scu/xg"));

// 浙江工商大学
router.get("/zjgsu/tzgg", lazyRequire("./routes/universities/zjgsu/tzgg/scripts"));
router.get("/zjgsu/gsgg", lazyRequire("./routes/universities/zjgsu/gsgg/scripts"));
router.get("/zjgsu/xszq", lazyRequire("./routes/universities/zjgsu/xszq/scripts"));

// 大众点评
router.get("/dianping/user/:id?", lazyRequire("./routes/dianping/user"));

// 半月谈
router.get("/banyuetan/:name", lazyRequire("./routes/banyuetan"));

// 人民日报
router.get("/people/opinion/:id", lazyRequire("./routes/people/opinion"));
router.get("/people/env/:id", lazyRequire("./routes/people/env"));
router.get("/people/xjpjh/:keyword?/:year?", lazyRequire("./routes/people/xjpjh"));

// 北极星电力网
router.get("/bjx/huanbao", lazyRequire("./routes/bjx/huanbao"));

// gamersky
router.get("/gamersky/news", lazyRequire("./routes/gamersky/news"));
router.get("/gamersky/ent/:category", lazyRequire("./routes/gamersky/ent"));

// 游研社
router.get("/yystv/category/:category", lazyRequire("./routes/yystv/category"));

// psnine
router.get("/psnine/index", lazyRequire("./routes/psnine/index"));
router.get("/psnine/shuzhe", lazyRequire("./routes/psnine/shuzhe"));
router.get("/psnine/trade", lazyRequire("./routes/psnine/trade"));
router.get("/psnine/game", lazyRequire("./routes/psnine/game"));
router.get("/psnine/news", lazyRequire("./routes/psnine/news"));

// 浙江大学
router.get("/zju/list/:type", lazyRequire("./routes/universities/zju/list"));
router.get("/zju/physics/:type", lazyRequire("./routes/universities/zju/physics"));
router.get("/zju/grs/:type", lazyRequire("./routes/universities/zju/grs"));
router.get("/zju/career/:type", lazyRequire("./routes/universities/zju/career"));
router.get("/zju/cst/:type", lazyRequire("./routes/universities/zju/cst"));
router.get("/zju/cst/custom/:id", lazyRequire("./routes/universities/zju/cst/custom"));

// 浙江大学城市学院
router.get("/zucc/news/latest", lazyRequire("./routes/universities/zucc/news"));
router.get("/zucc/cssearch/latest/:webVpn/:key", lazyRequire("./routes/universities/zucc/cssearch"));

// 华中师范大学
router.get("/ccnu/career", lazyRequire("./routes/universities/ccnu/career"));

// Infoq
router.get("/infoq/recommend", lazyRequire("./routes/infoq/recommend"));
router.get("/infoq/topic/:id", lazyRequire("./routes/infoq/topic"));

// checkee
router.get("/checkee/:dispdate", lazyRequire("./routes/checkee/index"));

// 艾瑞
router.get("/iresearch/report", lazyRequire("./routes/iresearch/report"));

// ZAKER
router.get("/zaker/:type/:id", lazyRequire("./routes/zaker/source"));
router.get("/zaker/focusread", lazyRequire("./routes/zaker/focusread"));

// Matters
router.get("/matters/topics", lazyRequire("./routes/matters/topics"));
router.get("/matters/latest", lazyRequire("./routes/matters/latest"));
router.get("/matters/hot", lazyRequire("./routes/matters/hot"));
router.get("/matters/tags/:tid", lazyRequire("./routes/matters/tags"));
router.get("/matters/author/:uid", lazyRequire("./routes/matters/author"));

// MobData
router.get("/mobdata/report", lazyRequire("./routes/mobdata/report"));

// 谷雨
router.get("/tencent/guyu/channel/:name", lazyRequire("./routes/tencent/guyu/channel"));

// 古诗文网
router.get("/gushiwen/recommend/:annotation?", lazyRequire("./routes/gushiwen/recommend"));

// 电商在线
router.get("/imaijia/category/:category", lazyRequire("./routes/imaijia/category"));

// 21财经
router.get("/21caijing/channel/:name", lazyRequire("./routes/21caijing/channel"));

// 北京邮电大学
router.get("/bupt/yz/:type", lazyRequire("./routes/universities/bupt/yz"));
router.get("/bupt/grs", lazyRequire("./routes/universities/bupt/grs"));
router.get("/bupt/portal", lazyRequire("./routes/universities/bupt/portal"));
router.get("/bupt/news", lazyRequire("./routes/universities/bupt/news"));
router.get("/bupt/funbox", lazyRequire("./routes/universities/bupt/funbox"));

// VOCUS 方格子
router.get("/vocus/publication/:id", lazyRequire("./routes/vocus/publication"));
router.get("/vocus/user/:id", lazyRequire("./routes/vocus/user"));

// 一亩三分地 1point3acres
router.get("/1point3acres/user/:id/threads", lazyRequire("./routes/1point3acres/threads"));
router.get("/1point3acres/user/:id/posts", lazyRequire("./routes/1point3acres/posts"));
router.get("/1point3acres/offer/:year?/:major?/:school?", lazyRequire("./routes/1point3acres/offer"));
router.get("/1point3acres/post/:category", lazyRequire("./routes/1point3acres/post"));

// 广东海洋大学
router.get("/gdoujwc", lazyRequire("./routes/universities/gdou/jwc/jwtz"));

// 中国高清网
router.get("/gaoqingla/:tag?", lazyRequire("./routes/gaoqingla/latest"));

// 马良行
router.get("/mlhang", lazyRequire("./routes/mlhang/latest"));

// PlayStation Store
router.get("/ps/list/:gridName", lazyRequire("./routes/ps/list"));
router.get("/ps/trophy/:id", lazyRequire("./routes/ps/trophy"));
router.get("/ps/ps4updates", lazyRequire("./routes/ps/ps4updates"));
router.get("/ps/:lang?/product/:gridName", lazyRequire("./routes/ps/product"));

// Quanta Magazine
router.get("/quantamagazine/archive", lazyRequire("./routes/quantamagazine/archive"));

// Nintendo
router.get("/nintendo/eshop/jp", lazyRequire("./routes/nintendo/eshop_jp"));
router.get("/nintendo/eshop/hk", lazyRequire("./routes/nintendo/eshop_hk"));
router.get("/nintendo/eshop/us", lazyRequire("./routes/nintendo/eshop_us"));
router.get("/nintendo/eshop/cn", lazyRequire("./routes/nintendo/eshop_cn"));
router.get("/nintendo/news", lazyRequire("./routes/nintendo/news"));
router.get("/nintendo/news/china", lazyRequire("./routes/nintendo/news_china"));
router.get("/nintendo/direct", lazyRequire("./routes/nintendo/direct"));
router.get("/nintendo/system-update", lazyRequire("./routes/nintendo/system-update"));

// 世界卫生组织
router.get("/who/news-room/:type", lazyRequire("./routes/who/news-room"));

// 福利资源-met.red
router.get("/metred/fuli", lazyRequire("./routes/metred/fuli"));

// MIT
router.get("/mit/graduateadmissions/:type/:name", lazyRequire("./routes/universities/mit/graduateadmissions"));

// 毕马威
router.get("/kpmg/insights", lazyRequire("./routes/kpmg/insights"));

// Saraba1st
router.get("/saraba1st/thread/:tid", lazyRequire("./routes/saraba1st/thread"));

// gradcafe
router.get("/gradcafe/result/:type", lazyRequire("./routes/gradcafe/result"));
router.get("/gradcafe/result", lazyRequire("./routes/gradcafe/result"));

// The Economist
router.get("/the-economist/gre-vocabulary", lazyRequire("./routes/the-economist/gre-vocabulary"));
router.get("/the-economist/:endpoint", lazyRequire("./routes/the-economist/full"));

// 鼠绘漫画
router.get("/shuhui/comics/:id", lazyRequire("./routes/shuhui/comics"));

// 朝日新聞中文网（简体中文版）
router.get("/asahichinese-j/:category/:subCate", lazyRequire("./routes/asahichinese-j/index"));
router.get("/asahichinese-j/:category", lazyRequire("./routes/asahichinese-j/index"));

// 朝日新聞中文網（繁體中文版）
router.get("/asahichinese-f/:category/:subCate", lazyRequire("./routes/asahichinese-f/index"));
router.get("/asahichinese-f/:category", lazyRequire("./routes/asahichinese-f/index"));

// 7x24小时快讯
router.get("/fx678/kx", lazyRequire("./routes/fx678/kx"));

// SoundCloud
router.get("/soundcloud/tracks/:user", lazyRequire("./routes/soundcloud/tracks"));

// dilidili
router.get("/dilidili/fanju/:id", lazyRequire("./routes/dilidili/fanju"));

// 且听风吟福利
router.get("/qtfyfl/:category", lazyRequire("./routes/qtfyfl/category"));

// 派代
router.get("/paidai", lazyRequire("./routes/paidai/index"));
router.get("/paidai/bbs", lazyRequire("./routes/paidai/bbs"));
router.get("/paidai/news", lazyRequire("./routes/paidai/news"));

// 中国银行
router.get("/boc/whpj/:format?", lazyRequire("./routes/boc/whpj"));

// 漫画db
router.get("/manhuadb/comics/:id", lazyRequire("./routes/manhuadb/comics"));

// 装备前线
router.get("/zfrontier/postlist/:type", lazyRequire("./routes/zfrontier/postlist"));
router.get("/zfrontier/board/:boardId", lazyRequire("./routes/zfrontier/board_postlist"));

// 观察者风闻话题
router.get("/guanchazhe/topic/:id", lazyRequire("./routes/guanchazhe/topic"));
router.get("/guanchazhe/personalpage/:uid", lazyRequire("./routes/guanchazhe/personalpage"));
router.get("/guanchazhe/index/:type", lazyRequire("./routes/guanchazhe/index"));

// Hpoi 手办维基
router.get("/hpoi/info/:type?", lazyRequire("./routes/hpoi/info"));
router.get("/hpoi/:category/:words", lazyRequire("./routes/hpoi"));
router.get("/hpoi/user/:user_id/:caty", lazyRequire("./routes/hpoi/user"));

// 通用CurseForge
router.get("/curseforge/:gameid/:catagoryid/:projectid/files", lazyRequire("./routes/curseforge/generalfiles"));

// 西南财经大学
router.get("/swufe/seie/:type?", lazyRequire("./routes/universities/swufe/seie"));

// Wired
router.get("/wired/tag/:tag", lazyRequire("./routes/wired/tag"));

// 语雀文档
router.get("/yuque/doc/:repo_id", lazyRequire("./routes/yuque/doc"));

// 飞地
router.get("/enclavebooks/category/:id?", lazyRequire("./routes/enclavebooks/category"));
router.get("/enclavebooks/user/:uid", lazyRequire("./routes/enclavebooks/user.js"));
router.get("/enclavebooks/collection/:uid", lazyRequire("./routes/enclavebooks/collection.js"));

// 色花堂
router.get("/dsndsht23/picture/:subforumid", lazyRequire("./routes/dsndsht23/index"));
router.get("/dsndsht23/bt/:subforumid?", lazyRequire("./routes/dsndsht23/index"));
router.get("/dsndsht23/:subforumid?/:type?", lazyRequire("./routes/dsndsht23/index"));
router.get("/dsndsht23/:subforumid?", lazyRequire("./routes/dsndsht23/index"));
router.get("/dsndsht23", lazyRequire("./routes/dsndsht23/index"));

// 数英网最新文章
router.get("/digitaling/index", lazyRequire("./routes/digitaling/index"));

// 数英网文章专题
router.get("/digitaling/articles/:category/:subcate", lazyRequire("./routes/digitaling/article"));

// 数英网项目专题
router.get("/digitaling/projects/:category", lazyRequire("./routes/digitaling/project"));

// Bing壁纸
router.get("/bing", lazyRequire("./routes/bing/index"));

// Maxjia News - DotA 2
router.get("/maxnews/dota2", lazyRequire("./routes/maxnews/dota2"));

// 柠檬 - 私房歌
router.get("/ningmeng/song", lazyRequire("./routes/ningmeng/song"));

// 紫竹张
router.get("/zzz", lazyRequire("./routes/zzz/index"));

// AEON
router.get("/aeon/:cid", lazyRequire("./routes/aeon/category"));

// AlgoCasts
router.get("/algocasts", lazyRequire("./routes/algocasts/all"));

// aqicn
router.get("/aqicn/:city/:pollution?", lazyRequire("./routes/aqicn/index"));

// 猫眼电影
router.get("/maoyan/hot", lazyRequire("./routes/maoyan/hot"));
router.get("/maoyan/upcoming", lazyRequire("./routes/maoyan/upcoming"));

// cnBeta
router.get("/cnbeta", lazyRequire("./routes/cnbeta/home"));

// 国家退伍士兵信息
router.get("/gov/veterans/:type", lazyRequire("./routes/gov/veterans/china"));

// 河北省退伍士兵信息
router.get("/gov/veterans/hebei/:type", lazyRequire("./routes/gov/veterans/hebei"));

// Dilbert Comic Strip
router.get("/dilbert/strip", lazyRequire("./routes/dilbert/strip"));

// 游戏打折情报
router.get("/yxdzqb/:type", lazyRequire("./routes/yxdzqb"));

// 怪物猎人
router.get("/monsterhunter/update", lazyRequire("./routes/mhw/update"));
router.get("/mhw/update", lazyRequire("./routes/mhw/update"));
router.get("/mhw/news", lazyRequire("./routes/mhw/news"));

// 005.tv
router.get("/005tv/zx/latest", lazyRequire("./routes/005tv/zx"));

// Polimi News
router.get("/polimi/news/:language?", lazyRequire("./routes/polimi/news"));

// dekudeals
router.get("/dekudeals/:type", lazyRequire("./routes/dekudeals"));

// 直播吧
router.get("/zhibo8/forum/:id", lazyRequire("./routes/zhibo8/forum"));
router.get("/zhibo8/post/:id", lazyRequire("./routes/zhibo8/post"));
router.get("/zhibo8/more/:caty", lazyRequire("./routes/zhibo8/more"));

// 东方网-上海
router.get("/eastday/sh", lazyRequire("./routes/eastday/sh"));

// Metacritic
router.get("/metacritic/release/:platform/:type/:sort?", lazyRequire("./routes/metacritic/release"));

// 快科技（原驱动之家）
router.get("/kkj/news", lazyRequire("./routes/kkj/news"));

// Outage.Report
router.get("/outagereport/:name/:count?", lazyRequire("./routes/outagereport/service"));

// sixthtone
router.get("/sixthtone/news", lazyRequire("./routes/sixthtone/news"));

// AI研习社
router.get("/aiyanxishe/:id/:sort?", lazyRequire("./routes/aiyanxishe/home"));

// 活动行
router.get("/huodongxing/explore", lazyRequire("./routes/hdx/explore"));

// 飞客茶馆优惠信息
router.get("/flyertea/preferential", lazyRequire("./routes/flyertea/preferential"));
router.get("/flyertea/creditcard/:bank", lazyRequire("./routes/flyertea/creditcard"));

// 中国广播
router.get("/radio/:channelname/:name", lazyRequire("./routes/radio/radio"));

// TOPYS
router.get("/topys/:category", lazyRequire("./routes/topys/article"));

// 巴比特作者专栏
router.get("/8btc/:authorid", lazyRequire("./routes/8btc/author"));
router.get("/8btc/news/flash", lazyRequire("./routes/8btc/news/flash"));

// VueVlog
router.get("/vuevideo/:userid", lazyRequire("./routes/vuevideo/user"));

// 证监会
router.get("/csrc/news/:suffix?", lazyRequire("./routes/csrc/news"));
router.get("/csrc/fashenwei", lazyRequire("./routes/csrc/fashenwei"));
router.get("/csrc/auditstatus/:apply_id", lazyRequire("./routes/csrc/auditstatus"));

// LWN.net Alerts
router.get("/lwn/alerts/:distributor", lazyRequire("./routes/lwn/alerts"));

// 唱吧
router.get("/changba/:userid", lazyRequire("./routes/changba/user"));

// 英雄联盟
router.get("/lol/newsindex/:type", lazyRequire("./routes/lol/newsindex"));

// 掌上英雄联盟
router.get("/lolapp/recommend", lazyRequire("./routes/lolapp/recommend"));

// 左岸读书
router.get("/zreading", lazyRequire("./routes/zreading/home"));

// NBA
router.get("/nba/app_news", lazyRequire("./routes/nba/app_news"));

// 天津产权交易中心
router.get("/tprtc/cqzr", lazyRequire("./routes/tprtc/cqzr"));
router.get("/tprtc/qyzc", lazyRequire("./routes/tprtc/qyzc"));
router.get("/tprtc/news", lazyRequire("./routes/tprtc/news"));

// ArchDaily
router.get("/archdaily", lazyRequire("./routes/archdaily/home"));

// aptonic Dropzone actions
router.get("/aptonic/action/:untested?", lazyRequire("./routes/aptonic/action"));

// 印记中文周刊
router.get("/docschina/jsweekly", lazyRequire("./routes/docschina/jsweekly"));

// im2maker
router.get("/im2maker/:channel?", lazyRequire("./routes/im2maker/index"));

// 巨潮资讯
router.get("/cninfo/announcement/:code?/:category?", lazyRequire("./routes/cninfo/announcement"));
router.get("/cninfo/stock_announcement/:code", lazyRequire("./routes/cninfo/stock_announcement"));
router.get("/cninfo/fund_announcement/:code?/:searchkey?", lazyRequire("./routes/cninfo/fund_announcement"));

// 中央纪委国家监委网站
router.get("/ccdi/scdc", lazyRequire("./routes/ccdi/scdc"));

// 中华人民共和国农业农村部
router.get("/gov/moa/sjzxfb", lazyRequire("./routes/gov/moa/sjzxfb"));
router.get("/gov/moa/:suburl(.*)", lazyRequire("./routes/gov/moa/moa"));

// 香水时代
router.get("/nosetime/:id/:type/:sort?", lazyRequire("./routes/nosetime/comment"));
router.get("/nosetime/home", lazyRequire("./routes/nosetime/home"));

// 涂鸦王国
router.get("/gracg/:user/:love?", lazyRequire("./routes/gracg/user"));

// 大侠阿木
router.get("/daxiaamu/home", lazyRequire("./routes/daxiaamu/home"));

// 美团技术团队
router.get("/meituan/tech/home", lazyRequire("./routes//meituan/tech/home"));

// 码农网
router.get("/codeceo/home", lazyRequire("./routes/codeceo/home"));
router.get("/codeceo/:type/:category?", lazyRequire("./routes/codeceo/category"));

// BOF
router.get("/bof/home", lazyRequire("./routes/bof/home"));

// 爱发电
router.get("/afdian/explore/:type?/:category?", lazyRequire("./routes/afdian/explore"));
router.get("/afdian/dynamic/:uid", lazyRequire("./routes/afdian/dynamic"));

// Simons Foundation
router.get("/simonsfoundation/articles", lazyRequire("./routes/simonsfoundation/articles"));
router.get("/simonsfoundation/recommend", lazyRequire("./routes/simonsfoundation/recommend"));

// 王者荣耀
router.get("/tencent/pvp/newsindex/:type", lazyRequire("./routes/tencent/pvp/newsindex"));

// 《明日方舟》游戏
router.get("/arknights/news", lazyRequire("./routes/arknights/news"));

// ff14
router.get("/ff14/ff14_zh/:type", lazyRequire("./routes/ff14/ff14_zh"));

// 学堂在线
router.get("/xuetangx/course/:cid/:type", lazyRequire("./routes/xuetangx/course_info"));
router.get("/xuetangx/course/list/:mode/:credential/:status/:type?", lazyRequire("./routes/xuetangx/course_list"));

// wikihow
router.get("/wikihow/index", lazyRequire("./routes/wikihow/index.js"));
router.get("/wikihow/category/:category/:type", lazyRequire("./routes/wikihow/category.js"));

// 正版中国
router.get("/getitfree/category/:category?", lazyRequire("./routes/getitfree/category.js"));
router.get("/getitfree/search/:keyword?", lazyRequire("./routes/getitfree/search.js"));

// 万联网
router.get("/10000link/news/:category?", lazyRequire("./routes/10000link/news"));

// 站酷
router.get("/zcool/recommend/:type", lazyRequire("./routes/zcool/recommend"));
router.get("/zcool/top/:type", lazyRequire("./routes/zcool/top"));
router.get("/zcool/top", lazyRequire("./routes/zcool/top")); // 兼容老版本
router.get("/zcool/user/:uid", lazyRequire("./routes/zcool/user"));

// 第一财经
router.get("/yicai/brief", lazyRequire("./routes/yicai/brief.js"));

// 一兜糖
router.get("/yidoutang/index", lazyRequire("./routes/yidoutang/index.js"));
router.get("/yidoutang/guide", lazyRequire("./routes/yidoutang/guide.js"));
router.get("/yidoutang/mtest", lazyRequire("./routes/yidoutang/mtest.js"));
router.get("/yidoutang/case/:type", lazyRequire("./routes/yidoutang/case.js"));

// 开眼
router.get("/kaiyan/index", lazyRequire("./routes/kaiyan/index"));

// 龙空
router.get("/lkong/forum/:id/:digest?", lazyRequire("./routes/lkong/forum"));
router.get("/lkong/thread/:id", lazyRequire("./routes/lkong/thread"));
// router.get('/lkong/user/:id', require('./routes/lkong/user'));

// 坂道系列资讯
// 坂道系列官网新闻
router.get("/nogizaka46/news", lazyRequire("./routes/nogizaka46/news"));
router.get("/keyakizaka46/news", lazyRequire("./routes/keyakizaka46/news"));
router.get("/hinatazaka46/news", lazyRequire("./routes/hinatazaka46/news"));
router.get("/keyakizaka46/blog", lazyRequire("./routes/keyakizaka46/blog"));
router.get("/hinatazaka46/blog", lazyRequire("./routes/hinatazaka46/blog"));

// 酷安
router.get("/coolapk/tuwen", lazyRequire("./routes/coolapk/tuwen"));
router.get("/coolapk/tuwen-xinxian", lazyRequire("./routes/coolapk/tuwen"));
router.get("/coolapk/huati/:tag", lazyRequire("./routes/coolapk/huati"));
router.get("/coolapk/user/:uid/dynamic", lazyRequire("./routes/coolapk/userDynamic"));
router.get("/coolapk/dyh/:dyhId", lazyRequire("./routes/coolapk/dyh"));

// 模型网
router.get("/moxingnet", lazyRequire("./routes/moxingnet"));

// 湖北大学
router.get("/hubu/news/:type", lazyRequire("./routes/universities/hubu/news"));

// 大连海事大学
router.get("/dlmu/news/:type", lazyRequire("./routes/universities/dlmu/news"));
router.get("/dlmu/grs/zsgz/:type", lazyRequire("./routes/universities/dlmu/grs/zsgz"));

// Rockstar Games Social Club
router.get("/socialclub/events/:game?", lazyRequire("./routes/socialclub/events"));

// CTFHub Event Calendar
router.get("/ctfhub/calendar/:limit?/:form?/:class?/:title?", lazyRequire("./routes/ctfhub"));

// 阿里云
router.get("/aliyun/database_month", lazyRequire("./routes/aliyun/database_month"));
router.get("/aliyun/notice/:type?", lazyRequire("./routes/aliyun/notice"));
router.get("/aliyun/developer/group/:type", lazyRequire("./routes/aliyun/developer/group"));

// 礼物说
router.get("/liwushuo/index", lazyRequire("./routes/liwushuo/index.js"));

// 故事fm
router.get("/storyfm/index", lazyRequire("./routes/storyfm/index.js"));

// 中国日报
router.get("/chinadaily/english/:category", lazyRequire("./routes/chinadaily/english.js"));

// leboncoin
router.get("/leboncoin/ad/:query", lazyRequire("./routes/leboncoin/ad.js"));

// DHL
router.get("/dhl/:id", lazyRequire("./routes/dhl/shipment-tracking"));

// Japanpost
router.get("/japanpost/:reqCode/:locale?", lazyRequire("./routes/japanpost/index"));

// 中华人民共和国商务部
router.get("/mofcom/article/:suffix", lazyRequire("./routes/mofcom/article"));

// 字幕库
router.get("/zimuku/:type?", lazyRequire("./routes/zimuku/index"));

// 品玩
router.get("/pingwest/status", lazyRequire("./routes/pingwest/status"));
router.get("/pingwest/tag/:tag/:type", lazyRequire("./routes/pingwest/tag"));
router.get("/pingwest/user/:uid/:type?", lazyRequire("./routes/pingwest/user"));

// Hanime
router.get("/hanime/video", lazyRequire("./routes/hanime/video"));

// 篝火营地
router.get("/gouhuo/news/:category", lazyRequire("./routes/gouhuo"));
router.get("/gouhuo/strategy", lazyRequire("./routes/gouhuo/strategy"));

// Soul
router.get("/soul/:id", lazyRequire("./routes/soul"));
router.get("/soul/posts/hot", lazyRequire("./routes/soul/hot"));

// 单向空间
router.get("/owspace/read/:type?", lazyRequire("./routes/owspace/read"));

// 天涯论坛
router.get("/tianya/index/:type", lazyRequire("./routes/tianya/index"));
router.get("/tianya/user/:userid", lazyRequire("./routes/tianya/user"));
router.get("/tianya/comments/:userid", lazyRequire("./routes/tianya/comments"));

// eleme
router.get("/eleme/open/announce", lazyRequire("./routes/eleme/open/announce"));
router.get("/eleme/open-be/announce", lazyRequire("./routes/eleme/open-be/announce"));

// 微信开放社区
router.get("/wechat-open/community/:type", lazyRequire("./routes/tencent/wechat/wechat-open/community/announce"));
// 微信支付 - 商户平台公告
router.get("/wechat-open/pay/announce", lazyRequire("./routes/tencent/wechat/wechat-open/pay/announce"));
router.get("/wechat-open/community/:type/:category", lazyRequire("./routes/tencent/wechat/wechat-open/community/question"));

// 微店
router.get("/weidian/goods/:id", lazyRequire("./routes/weidian/goods"));

// 有赞
router.get("/youzan/goods/:id", lazyRequire("./routes/youzan/goods"));
// 币世界快讯
router.get("/bishijie/kuaixun", lazyRequire("./routes/bishijie/kuaixun"));

// 顺丰丰桥
router.get("/sf/sffq-announce", lazyRequire("./routes/sf/sffq-announce"));

// 缺书网
router.get("/queshu/sale", lazyRequire("./routes/queshu/sale"));
router.get("/queshu/book/:bookid", lazyRequire("./routes/queshu/book"));

// MITRE
router.get("/mitre/publications", lazyRequire("./routes/mitre/publications"));

// SANS
router.get("/sans/summit_archive", lazyRequire("./routes/sans/summit_archive"));

// LaTeX 开源小屋
router.get("/latexstudio/home", lazyRequire("./routes/latexstudio/home"));

// 上证债券信息网 - 可转换公司债券公告
router.get("/sse/convert/:query?", lazyRequire("./routes/sse/convert"));
router.get("/sse/renewal", lazyRequire("./routes/sse/renewal"));
router.get("/sse/inquire", lazyRequire("./routes/sse/inquire"));

// 上海证券交易所
router.get("/sse/disclosure/:query?", lazyRequire("./routes/sse/disclosure"));

// 深圳证券交易所
router.get("/szse/notice", lazyRequire("./routes/szse/notice"));
router.get("/szse/inquire/:type", lazyRequire("./routes/szse/inquire"));
router.get("/szse/rule", lazyRequire("./routes/szse/rule"));

// 前端艺术家每日整理&&飞冰早报
router.get("/jskou/:type?", lazyRequire("./routes/jskou/index"));

// 国家应急广播
router.get("/cneb/yjxx", lazyRequire("./routes/cneb/yjxx"));
router.get("/cneb/guoneinews", lazyRequire("./routes/cneb/guoneinews"));

// 好队友
router.get("/network360/jobs", lazyRequire("./routes/network360/jobs"));

// 智联招聘
router.get("/zhilian/:city/:keyword", lazyRequire("./routes/zhilian/index"));

// 电鸭社区
router.get("/eleduck/jobs", lazyRequire("./routes/eleduck/jobs"));

// 北华航天工业学院 - 新闻
router.get("/nciae/news", lazyRequire("./routes/universities/nciae/news"));

// 北华航天工业学院 - 通知公告
router.get("/nciae/tzgg", lazyRequire("./routes/universities/nciae/tzgg"));

// 北华航天工业学院 - 学术信息
router.get("/nciae/xsxx", lazyRequire("./routes/universities/nciae/xsxx"));

// cfan
router.get("/cfan/news", lazyRequire("./routes/cfan/news"));

// 搜狐 - 搜狐号
router.get("/sohu/mp/:id", lazyRequire("./routes/sohu/mp"));

// 腾讯企鹅号
router.get("/tencent/news/author/:mid", lazyRequire("./routes/tencent/news/author"));

// 腾讯柠檬精选
router.get("/tencent/lemon", lazyRequire("./routes/tencent/lemon/index"));

// 奈菲影视
router.get("/nfmovies/:id?", lazyRequire("./routes/nfmovies/index"));

// 书友社区
router.get("/andyt/:view?", lazyRequire("./routes/andyt/index"));

// 品途商业评论
router.get("/pintu360/:type?", lazyRequire("./routes/pintu360/index"));

// engadget中国版
router.get("/engadget-cn", lazyRequire("./routes/engadget/home"));

// engadget
router.get("/engadget/:lang?", lazyRequire("./routes/engadget/home"));

// 吹牛部落
router.get("/chuiniu/column/:id", lazyRequire("./routes/chuiniu/column"));
router.get("/chuiniu/column_list", lazyRequire("./routes/chuiniu/column_list"));

// leemeng
router.get("/leemeng", lazyRequire("./routes/blogs/leemeng"));

// 中国地质大学
router.get("/cug/graduate", lazyRequire("./routes/cug/graduate"));
router.get("/cug/undergraduate", lazyRequire("./routes/cug/undergraduate"));
router.get("/cug/xgxy", lazyRequire("./routes/cug/xgxy"));

// 网易 - 网易号
router.get("/netease/dy/:id", lazyRequire("./routes/netease/dy"));

// 海猫吧
router.get("/haimaoba/:id?", lazyRequire("./routes/haimaoba/comics"));

// 路透社
router.get("/reuters/channel/:site/:channel", lazyRequire("./routes/reuters/channel"));

// 蒲公英
router.get("/pgyer/:app?", lazyRequire("./routes/pgyer/app"));

// 微博个人时间线
router.get("/weibo/timeline/:uid/:feature?", lazyRequire("./routes/weibo/timeline"));

// TAPTAP
router.get("/taptap/topic/:id/:label?", lazyRequire("./routes/taptap/topic"));
router.get("/taptap/changelog/:id", lazyRequire("./routes/taptap/changelog"));
router.get("/taptap/review/:id/:order?", lazyRequire("./routes/taptap/review"));

// lofter
router.get("/lofter/tag/:name/:type?", lazyRequire("./routes/lofter/tag"));
router.get("/lofter/user/:username", lazyRequire("./routes/lofter/posts"));

// 米坛社区表盘
router.get("/watchface/:watch_type?/:list_type?", lazyRequire("./routes/watchface/update"));

// CNU视觉联盟
router.get("/cnu/selected", lazyRequire("./routes/cnu/selected"));
router.get("/cnu/discovery/:type?/:category?", lazyRequire("./routes/cnu/discovery"));

// 战旗直播
router.get("/zhanqi/room/:id", lazyRequire("./routes/zhanqi/room"));

// 酒云网
router.get("/wineyun/:category", lazyRequire("./routes/wineyun"));

// 小红书
router.get("/xiaohongshu/user/:user_id/:category", lazyRequire("./routes/xiaohongshu/user"));
router.get("/xiaohongshu/board/:board_id", lazyRequire("./routes/xiaohongshu/board"));

// 重磅原创-每经网
router.get("/nbd/daily", lazyRequire("./routes/nbd/article"));

// 快知
router.get("/kzfeed/topic/:id", lazyRequire("./routes/kzfeed/topic"));

// 腾讯新闻较真查证平台
router.get("/factcheck", lazyRequire("./routes/tencent/factcheck"));

// X-MOL化学资讯平台
router.get("/x-mol/news/:tag?", lazyRequire("./routes/x-mol/news.js"));
router.get("/x-mol/paper/:type/:magazine", lazyRequire("./routes/x-mol/paper"));

// 知识分子
router.get("/zhishifenzi/news/:type?", lazyRequire("./routes/zhishifenzi/news"));
router.get("/zhishifenzi/depth", lazyRequire("./routes/zhishifenzi/depth"));
router.get("/zhishifenzi/innovation/:type?", lazyRequire("./routes/zhishifenzi/innovation"));

// 電撃Online
router.get("/dengekionline/:type?", lazyRequire("./routes/dengekionline/new"));

// 4Gamers
router.get("/4gamers/category/:category", lazyRequire("./routes/4gamers/category"));
router.get("/4gamers/tag/:tag", lazyRequire("./routes/4gamers/tag"));
router.get("/4gamers/topic/:topic", lazyRequire("./routes/4gamers/topic"));

// 大麦网
router.get("/damai/activity/:city/:category/:subcategory/:keyword?", lazyRequire("./routes/damai/activity"));

// 桂林电子科技大学新闻资讯
router.get("/guet/xwzx/:type?", lazyRequire("./routes/guet/news"));

// はてな匿名ダイアリー
router.get("/hatena/anonymous_diary/archive", lazyRequire("./routes/hatena/anonymous_diary/archive"));

// kaggle
router.get("/kaggle/discussion/:forumId/:sort?", lazyRequire("./routes/kaggle/discussion"));
router.get("/kaggle/competitions/:category?", lazyRequire("./routes/kaggle/competitions"));
router.get("/kaggle/user/:user", lazyRequire("./routes/kaggle/user"));

// PubMed Trending
router.get("/pubmed/trending", lazyRequire("./routes/pubmed/trending"));

// 领科 (linkresearcher.com)
router.get("/linkresearcher/:params", lazyRequire("./routes/linkresearcher/index"));

// eLife [Sci Journal]
router.get("/elife/:tid", lazyRequire("./routes/elife/index"));

// IEEE Xplore [Sci Journal]
router.get("/ieee/author/:aid/:sortType/:count?", lazyRequire("./routes/ieee/author"));

// PNAS [Sci Journal]
router.get("/pnas/:topic?", lazyRequire("./routes/pnas/index"));

// cell [Sci Journal]
router.get("/cell/cell/:category", lazyRequire("./routes/cell/cell/index"));
router.get("/cell/cover", lazyRequire("./routes/cell/cover"));

// nature + nature 子刊 [Sci Journal]
router.get("/nature/research/:journal?", lazyRequire("./routes/nature/research"));
router.get("/nature/news-and-comment/:journal?", lazyRequire("./routes/nature/news-and-comment"));
router.get("/nature/cover", lazyRequire("./routes/nature/cover"));
router.get("/nature/news", lazyRequire("./routes/nature/news"));
router.get("/nature/highlight", lazyRequire("./routes/nature/highlight"));

// science [Sci Journal]
router.get("/sciencemag/current/:journal?", lazyRequire("./routes/sciencemag/current"));
router.get("/sciencemag/cover", lazyRequire("./routes/sciencemag/cover"));
router.get("/sciencemag/early/science", lazyRequire("./routes/sciencemag/early"));

// dlsite
router.get("/dlsite/new/:type", lazyRequire("./routes/dlsite/new"));
router.get("/dlsite/campaign/:type/:free?", lazyRequire("./routes/dlsite/campaign"));

// mcbbs
router.get("/mcbbs/forum/:type", lazyRequire("./routes/mcbbs/forum"));
router.get("/mcbbs/post/:tid/:authorid?", lazyRequire("./routes/mcbbs/post"));

// Pocket
router.get("/pocket/trending", lazyRequire("./routes/pocket/trending"));

// HK01
router.get("/hk01/zone/:id", lazyRequire("./routes/hk01/zone"));
router.get("/hk01/channel/:id", lazyRequire("./routes/hk01/channel"));
router.get("/hk01/issue/:id", lazyRequire("./routes/hk01/issue"));
router.get("/hk01/tag/:id", lazyRequire("./routes/hk01/tag"));
router.get("/hk01/hot", lazyRequire("./routes/hk01/hot"));

// 码农周刊
router.get("/manong-weekly", lazyRequire("./routes/manong-weekly/issues"));

// 每日猪价
router.get("/pork-price", lazyRequire("./routes/pork-price"));

// NOI 全国青少年信息学奥林匹克竞赛
router.get("/noi", lazyRequire("./routes/noi"));
router.get("/noi/winners-list", lazyRequire("./routes/noi/winners-list"));
router.get("/noi/province-news", lazyRequire("./routes/noi/province-news"));
router.get("/noi/rg-news", lazyRequire("./routes/noi/rg-news"));

// 中国工业化和信息部
router.get("/gov/miit/zcwj", lazyRequire("./routes/gov/miit/zcwj"));
router.get("/gov/miit/wjgs", lazyRequire("./routes/gov/miit/wjgs"));
router.get("/gov/miit/zcjd", lazyRequire("./routes/gov/miit/zcjd"));

// 中国国家认证认可监管管理员会
router.get("/gov/cnca/jgdt", lazyRequire("./routes/gov/cnca/jgdt"));
router.get("/gov/cnca/hydt", lazyRequire("./routes/gov/cnca/hydt"));

router.get("/gov/cnca/zxtz", lazyRequire("./routes/gov/cnca/zxtz"));

// clickme
router.get("/clickme/:site/:grouping/:name", lazyRequire("./routes/clickme"));

// 文汇报
router.get("/whb/:category", lazyRequire("./routes/whb/zhuzhan"));

// 三界异次元
router.get("/3ycy/home", lazyRequire("./routes/3ycy/home.js"));

// Emi Nitta official website
router.get("/emi-nitta/:type", lazyRequire("./routes/emi-nitta/home"));

// Alter China
router.get("/alter-cn/news", lazyRequire("./routes/alter-cn/news"));

// Visual Studio Code Marketplace
router.get("/vscode/marketplace/:type?", lazyRequire("./routes/vscode/marketplace"));

// 饭否
router.get("/fanfou/user_timeline/:uid", lazyRequire("./routes/fanfou/user_timeline"));
router.get("/fanfou/home_timeline", lazyRequire("./routes/fanfou/home_timeline"));
router.get("/fanfou/favorites/:uid", lazyRequire("./routes/fanfou/favorites"));
router.get("/fanfou/trends", lazyRequire("./routes/fanfou/trends"));
router.get("/fanfou/public_timeline/:keyword", lazyRequire("./routes/fanfou/public_timeline"));

// ITSlide
router.get("/itslide/new", lazyRequire("./routes/itslide/new"));

// Remote Work
router.get("/remote-work/:caty?", lazyRequire("./routes/remote-work/index"));

// China Times
router.get("/chinatimes/:caty", lazyRequire("./routes/chinatimes/index"));

// TransferWise
router.get("/transferwise/pair/:source/:target", lazyRequire("./routes/transferwise/pair"));

// chocolatey
router.get("/chocolatey/software/:name?", lazyRequire("./routes/chocolatey/software"));

// Nyaa
router.get("/nyaa/search/:query?", lazyRequire("./routes/nyaa/search"));

// 片源网
router.get("/pianyuan/:media?", lazyRequire("./routes/pianyuan/app"));

// ITHome
router.get("/ithome/ranking/:type", lazyRequire("./routes/ithome/ranking"));

// 巴哈姆特
router.get("/bahamut/creation/:author/:category?", lazyRequire("./routes/bahamut/creation"));
router.get("/bahamut/creation_index/:category?/:subcategory?/:type?", lazyRequire("./routes/bahamut/creation_index"));

// CentBrowser
router.get("/centbrowser/history", lazyRequire("./routes/centbrowser/history"));

// 755
router.get("/755/user/:username", lazyRequire("./routes/755/user"));

// IKEA
router.get("/ikea/uk/new", lazyRequire("./routes/ikea/uk/new"));
router.get("/ikea/uk/offer", lazyRequire("./routes/ikea/uk/offer"));

// Mastodon
router.get("/mastodon/timeline/:site/:only_media?", lazyRequire("./routes/mastodon/timeline_local"));
router.get("/mastodon/remote/:site/:only_media?", lazyRequire("./routes/mastodon/timeline_remote"));
router.get("/mastodon/account_id/:site/:account_id/statuses/:only_media?", lazyRequire("./routes/mastodon/account_id"));
router.get("/mastodon/acct/:acct/statuses/:only_media?", lazyRequire("./routes/mastodon/acct"));

// Kernel Aliyun
router.get("/aliyun-kernel/index", lazyRequire("./routes/aliyun-kernel/index"));

// Vulture
router.get("/vulture/:tag/:excludetags?", lazyRequire("./routes/vulture/index"));

// xinwenlianbo
router.get("/xinwenlianbo/index", lazyRequire("./routes/xinwenlianbo/index"));

// Paul Graham - Essays
router.get("/blogs/paulgraham", lazyRequire("./routes/blogs/paulgraham"));

// invisionapp
router.get("/invisionapp/inside-design", lazyRequire("./routes/invisionapp/inside-design"));

// producthunt
router.get("/producthunt/today", lazyRequire("./routes/producthunt/today"));

// mlog.club
router.get("/mlog-club/topics/:node", lazyRequire("./routes/mlog-club/topics"));
router.get("/mlog-club/projects", lazyRequire("./routes/mlog-club/projects"));

// Chrome 网上应用店
router.get("/chrome/webstore/extensions/:id", lazyRequire("./routes/chrome/extensions"));

// RTHK
router.get("/rthk-news/:lang/:category", lazyRequire("./routes/rthk-news/index"));

// yahoo
router.get("/yahoo-news/:region/:category?", lazyRequire("./routes/yahoo-news/index"));

// Yahoo!テレビ
router.get("/yahoo-jp-tv/:query", lazyRequire("./routes/yahoo-jp-tv/index"));

// 低端影视
router.get("/ddrk/update/:name/:season?", lazyRequire("./routes/ddrk/index"));
router.get("/ddrk/tag/:tag", lazyRequire("./routes/ddrk/list"));
router.get("/ddrk/category/:category", lazyRequire("./routes/ddrk/list"));
router.get("/ddrk/index", lazyRequire("./routes/ddrk/list"));

// avgle
router.get("/avgle/videos/:order?/:time?/:top?", lazyRequire("./routes/avgle/videos.js"));
router.get("/avgle/search/:keyword/:order?/:time?/:top?", lazyRequire("./routes/avgle/videos.js"));

// 公主链接公告
router.get("/pcr/news", lazyRequire("./routes/pcr/news"));
router.get("/pcr/news-tw", lazyRequire("./routes/pcr/news-tw"));
router.get("/pcr/news-cn", lazyRequire("./routes/pcr/news-cn"));

// project-zero issues
router.get("/project-zero-issues", lazyRequire("./routes/project-zero-issues/index"));

// 平安银河实验室
router.get("/galaxylab", lazyRequire("./routes/galaxylab/index"));

// NOSEC 安全讯息平台
router.get("/nosec/:keykind?", lazyRequire("./routes/nosec/index"));

// Hex-Rays News
router.get("/hex-rays/news", lazyRequire("./routes/hex-rays/index"));

// 新趣集
router.get("/xinquji/today", lazyRequire("./routes/xinquji/today"));
router.get("/xinquji/today/internal", lazyRequire("./routes/xinquji/internal"));

// 英中协会
router.get("/gbcc/trust", lazyRequire("./routes/gbcc/trust"));

// Associated Press
router.get("/apnews/topics/:topic", lazyRequire("./routes/apnews/topics"));

// CBC
router.get("/cbc/topics/:topic?", lazyRequire("./routes/cbc/topics"));

// discuz
router.get("/discuz/:ver([7|x])/:cid([0-9]{2})/:link(.*)", lazyRequire("./routes/discuz/discuz"));
router.get("/discuz/:ver([7|x])/:link(.*)", lazyRequire("./routes/discuz/discuz"));
router.get("/discuz/:link(.*)", lazyRequire("./routes/discuz/discuz"));

// China Dialogue 中外对话
router.get("/chinadialogue/topics/:topic", lazyRequire("./routes/chinadialogue/topics"));
router.get("/chinadialogue/:column", lazyRequire("./routes/chinadialogue/column"));

// 人民日报社 国际金融报
router.get("/ifnews/:cid", lazyRequire("./routes/ifnews/column"));

// Scala Blog
router.get("/scala/blog/:part?", lazyRequire("./routes/scala-blog/scala-blog"));

// Minecraft Java版游戏更新
router.get("/minecraft/version", lazyRequire("./routes/minecraft/version"));

// 微信更新日志
router.get("/weixin/miniprogram/release", lazyRequire("./routes/tencent/wechat/miniprogram/framework")); // 基础库更新日志
router.get("/weixin/miniprogram/framework", lazyRequire("./routes/tencent/wechat/miniprogram/framework")); // 基础库更新日志
router.get("/weixin/miniprogram/devtools", lazyRequire("./routes/tencent/wechat/miniprogram/devtools")); // 开发者工具更新日志
router.get("/weixin/miniprogram/wxcloud/:caty?", lazyRequire("./routes/tencent/wechat/miniprogram/wxcloud")); // 云开发更新日志

// 武汉肺炎疫情动态
router.get("/coronavirus/caixin", lazyRequire("./routes/coronavirus/caixin"));
router.get("/coronavirus/dxy/data/:province?/:city?", lazyRequire("./routes/coronavirus/dxy-data"));
router.get("/coronavirus/dxy", lazyRequire("./routes/coronavirus/dxy"));
router.get("/coronavirus/scmp", lazyRequire("./routes/coronavirus/scmp"));
router.get("/coronavirus/nhc", lazyRequire("./routes/coronavirus/nhc"));
router.get("/coronavirus/mogov-2019ncov/:lang", lazyRequire("./routes/coronavirus/mogov-2019ncov"));
router.get("/coronavirus/qq/fact", lazyRequire("./routes/tencent/factcheck"));
router.get("/coronavirus/sg-moh", lazyRequire("./routes/coronavirus/sg-moh"));

// 南京林业大学教务处
router.get("/njfu/jwc/:category?", lazyRequire("./routes/universities/njfu/jwc"));

// 日本経済新聞
router.get("/nikkei/index", lazyRequire("./routes/nikkei/index"));
router.get("/nikkei/:category/:article_type?", lazyRequire("./routes/nikkei/news"));

// MQube
router.get("/mqube/user/:user", lazyRequire("./routes/mqube/user"));
router.get("/mqube/tag/:tag", lazyRequire("./routes/mqube/tag"));
router.get("/mqube/latest", lazyRequire("./routes/mqube/latest"));
router.get("/mqube/top", lazyRequire("./routes/mqube/top"));

// Letterboxd
router.get("/letterboxd/user/diary/:username", lazyRequire("./routes/letterboxd/userdiary"));
router.get("/letterboxd/user/followingdiary/:username", lazyRequire("./routes/letterboxd/followingdiary"));

// 网易大神
router.get("/netease/ds/:id", lazyRequire("./routes/netease/ds"));

// javlibrary
router.get("/javlibrary/users/:uid/:utype", lazyRequire("./routes/javlibrary/users"));
router.get("/javlibrary/videos/:vtype", lazyRequire("./routes/javlibrary/videos"));
router.get("/javlibrary/stars/:sid", lazyRequire("./routes/javlibrary/stars"));
router.get("/javlibrary/bestreviews", lazyRequire("./routes/javlibrary/bestreviews"));

// Last.FM
router.get("/lastfm/recent/:user", lazyRequire("./routes/lastfm/recent"));
router.get("/lastfm/loved/:user", lazyRequire("./routes/lastfm/loved"));
router.get("/lastfm/top/:country?", lazyRequire("./routes/lastfm/top"));

// piapro
router.get("/piapro/user/:pid", lazyRequire("./routes/piapro/user"));
router.get("/piapro/public/:type/:tag?/:category?", lazyRequire("./routes/piapro/public"));

// 凤凰网
router.get("/ifeng/feng/:id/:type", lazyRequire("./routes/ifeng/feng"));

// 网易公开课
router.get("/open163/vip", lazyRequire("./routes/netease/open/vip"));
router.get("/open163/latest", lazyRequire("./routes/netease/open/latest"));

// 第一版主
router.get("/novel/d1bz/:category/:id", lazyRequire("./routes/d1bz/novel"));

// 爱下电子书
router.get("/axdzs/:id1/:id2", lazyRequire("./routes/novel/axdzs"));

// HackerOne
router.get("/hackerone/hacktivity", lazyRequire("./routes/hackerone/hacktivity"));

// 奶牛关
router.get("/cowlevel/element/:id", lazyRequire("./routes/cowlevel/element"));

// 2048
router.get("/2048/bbs/:fid", lazyRequire("./routes/2048/bbs"));

// Google News
router.get("/google/news/:category/:locale", lazyRequire("./routes/google/news"));

// 虛詞
router.get("/p-articles/section/:section", lazyRequire("./routes/p-articles/section"));
router.get("/p-articles/contributors/:author", lazyRequire("./routes/p-articles/contributors"));

// finviz

router.get("/finviz/news/:ticker", lazyRequire("./routes/finviz/news"));

// 好好住
router.get("/haohaozhu/whole-house/:keyword?", lazyRequire("./routes/haohaozhu/whole-house"));
router.get("/haohaozhu/discover/:keyword?", lazyRequire("./routes/haohaozhu/discover"));

// 东北大学
router.get("/neu/news/:type", lazyRequire("./routes/universities/neu/news"));

// 快递100
router.get("/kuaidi100/track/:number/:id/:phone?", lazyRequire("./routes/kuaidi100/index"));
router.get("/kuaidi100/company", lazyRequire("./routes/kuaidi100/supported_company"));

// 稻草人书屋
router.get("/dcrsw/:name/:count?", lazyRequire("./routes/novel/dcrsw"));

// 魔法纪录
router.get("/magireco/announcements", lazyRequire("./routes/magireco/announcements"));
router.get("/magireco/event_banner", lazyRequire("./routes/magireco/event_banner"));

// wolley
router.get("/wolley", lazyRequire("./routes/wolley/index"));
router.get("/wolley/user/:id", lazyRequire("./routes/wolley/user"));
router.get("/wolley/host/:host", lazyRequire("./routes/wolley/host"));

// 西安交大
router.get("/xjtu/gs/tzgg", lazyRequire("./routes/universities/xjtu/gs/tzgg"));
router.get("/xjtu/dean/:subpath+", lazyRequire("./routes/universities/xjtu/dean"));
router.get("/xjtu/international/:subpath+", lazyRequire("./routes/universities/xjtu/international"));

// booksource
router.get("/booksource", lazyRequire("./routes/booksource/index"));

// ku
router.get("/ku/:name?", lazyRequire("./routes/ku/index"));

// 我有一片芝麻地
router.get("/blogs/hedwig/:type", lazyRequire("./routes/blogs/hedwig"));

// LoveHeaven
router.get("/loveheaven/update/:slug", lazyRequire("./routes/loveheaven/update"));

// 拉勾
router.get("/lagou/jobs/:position/:city", lazyRequire("./routes/lagou/jobs"));

// 扬州大学
router.get("/yzu/home/:type", lazyRequire("./routes/universities/yzu/home"));
router.get("/yzu/yjszs/:type", lazyRequire("./routes/universities/yzu/yjszs"));

// 国家自然科学基金委员会
router.get("/nsfc/news/:type?", lazyRequire("./routes/nsfc/news"));

// 德国新闻社卫健新闻
router.get("/krankenkassen", lazyRequire("./routes/krankenkassen"));

// 桂林航天工业学院
router.get("/guat/news/:type?", lazyRequire("./routes/guat/news"));

// 国家留学网
router.get("/csc/notice/:type?", lazyRequire("./routes/csc/notice"));

// LearnKu
router.get("/learnku/:community/:category?", lazyRequire("./routes/learnku/topic"));

// NEEA
router.get("/neea/:type", lazyRequire("./routes/neea"));

// 中国农业大学
router.get("/cauyjs", lazyRequire("./routes/universities/cauyjs/cauyjs"));

// 南方科技大学
router.get("/sustyjs", lazyRequire("./routes/universities/sustyjs/sustyjs"));

// 广州大学
router.get("/gzyjs", lazyRequire("./routes/universities/gzyjs/gzyjs"));

// 暨南大学
router.get("/jnu/xysx/:type", lazyRequire("./routes/universities/jnu/xysx/index"));
router.get("/jnu/yw/:type?", lazyRequire("./routes/universities/jnu/yw/index"));

// 深圳大学
router.get("/szuyjs", lazyRequire("./routes/universities/szuyjs/szuyjs"));

// 中国传媒大学
router.get("/cucyjs", lazyRequire("./routes/universities/cucyjs/cucyjs"));

// 中国农业大学信电学院
router.get("/cauele", lazyRequire("./routes/universities/cauyjs/cauyjs"));

// moxingfans
router.get("/moxingfans", lazyRequire("./routes/moxingfans"));

// Chiphell
router.get("/chiphell/forum/:forumId?", lazyRequire("./routes/chiphell/forum"));

// 华东理工大学研究生院
router.get("/ecustyjs", lazyRequire("./routes/universities/ecustyjs/ecustyjs"));

// 同济大学研究生院
router.get("/tjuyjs", lazyRequire("./routes/universities/tjuyjs/tjuyjs"));

// 中国石油大学研究生院
router.get("/upcyjs", lazyRequire("./routes/universities/upcyjs/upcyjs"));

// 中国海洋大学研究生院
router.get("/outyjs", lazyRequire("./routes/universities/outyjs/outyjs"));

// 中科院人工智能所
router.get("/zkyai", lazyRequire("./routes/universities/zkyai/zkyai"));

// 中科院自动化所
router.get("/zkyyjs", lazyRequire("./routes/universities/zkyyjs/zkyyjs"));

// 中国海洋大学信电学院
router.get("/outele", lazyRequire("./routes/universities/outele/outele"));

// 华东师范大学研究生院
router.get("/ecnuyjs", lazyRequire("./routes/universities/ecnuyjs/ecnuyjs"));

// 考研帮调剂信息
router.get("/kaoyan", lazyRequire("./routes/kaoyan/kaoyan"));

// 华中科技大学研究生院
router.get("/hustyjs", lazyRequire("./routes/universities/hustyjs/hustyjs"));

// 华中师范大学研究生院
router.get("/ccnuyjs", lazyRequire("./routes/universities/ccnu/ccnuyjs"));

// 华中师范大学计算机学院
router.get("/ccnucs", lazyRequire("./routes/universities/ccnu/ccnucs"));

// 华中师范大学伍论贡学院
router.get("/ccnuwu", lazyRequire("./routes/universities/ccnu/ccnuwu"));

// WEEX
router.get("/weexcn/news/:typeid", lazyRequire("./routes/weexcn/index"));

// 天天基金
router.get("/eastmoney/user/:uid", lazyRequire("./routes/eastmoney/user"));

// 紳士漫畫
router.get("/ssmh", lazyRequire("./routes/ssmh"));

// 武昌首义学院
router.get("/wsyu/news/:type?", lazyRequire("./routes/universities/wsyu/news"));

// 华南师范大学研究生学院
router.get("/scnuyjs", lazyRequire("./routes/universities/scnu/scnuyjs"));

// 华南师范大学软件学院
router.get("/scnucs", lazyRequire("./routes/universities/scnu/scnucs"));

// 华南理工大学研究生院
router.get("/scutyjs", lazyRequire("./routes/universities/scut/scutyjs"));

// 华南农业大学研究生院通知公告
router.get("/scauyjs", lazyRequire("./routes/universities/scauyjs/scauyjs"));

// 北京大学研究生招生网通知公告
router.get("/pkuyjs", lazyRequire("./routes/universities/pku/pkuyjs"));

// 北京理工大学研究生通知公告
router.get("/bityjs", lazyRequire("./routes/universities/bit/bityjs"));

// 湖南科技大学教务处
router.get("/hnust/jwc", lazyRequire("./routes/universities/hnust/jwc/index"));
router.get("/hnust/computer", lazyRequire("./routes/universities/hnust/computer/index"));
router.get("/hnust/art", lazyRequire("./routes/universities/hnust/art/index"));
router.get("/hnust/graduate/:type?", lazyRequire("./routes/universities/hnust/graduate/index"));

// 西南交通大学
router.get("/swjtu/tl/news", lazyRequire("./routes/swjtu/tl/news"));

// AGE动漫
router.get("/agefans/detail/:id", lazyRequire("./routes/agefans/detail"));

// Checkra1n
router.get("/checkra1n/releases", lazyRequire("./routes/checkra1n/releases"));

// 四川省科学技术厅
router.get("/sckjt/news/:type?", lazyRequire("./routes/sckjt/news"));

// Hi, DIYgod
router.get("/blogs/diygod/animal-crossing", lazyRequire("./routes/blogs/diygod/animal-crossing"));
router.get("/blogs/diygod/gk", lazyRequire("./routes/blogs/diygod/gk"));

// 湖北工业大学
router.get("/hbut/news/:type", lazyRequire("./routes/universities/hbut/news"));
router.get("/hbut/cs/:type", lazyRequire("./routes/universities/hbut/cs"));

// acwifi
router.get("/acwifi", lazyRequire("./routes/acwifi"));

// a岛匿名版
router.get("/adnmb/:pid", lazyRequire("./routes/adnmb/index"));

// MIT科技评论
router.get("/mittrchina/article", lazyRequire("./routes/mittrchina"));

// 消费者报道
router.get("/ccreports/article", lazyRequire("./routes/ccreports"));

// iYouPort
router.get("/iyouport/article", lazyRequire("./routes/iyouport"));
router.get("/iyouport/:category?", lazyRequire("./routes/iyouport"));

// girlimg
router.get("/girlimg/album/:tag?/:mode?", lazyRequire("./routes/girlimg/album"));

// etoland
router.get("/etoland/:bo_table", lazyRequire("./routes/etoland/board"));

// 辽宁工程技术大学教务在线公告
router.get("/lntu/jwnews", lazyRequire("./routes/universities/lntu/jwnews"));

// 51voa
router.get("/51voa/:channel", lazyRequire("./routes/51voa/channel"));

// zhuixinfan
router.get("/zhuixinfan/list", lazyRequire("./routes/zhuixinfan/list"));

// scoresaber
router.get("/scoresaber/user/:id", lazyRequire("./routes/scoresaber/user"));

// blur-studio
router.get("/blur-studio", lazyRequire("./routes/blur-studio/index"));

// method-studios
router.get("/method-studios/:menu?", lazyRequire("./routes/method-studios/index"));

// blow-studio
router.get("/blow-studio", lazyRequire("./routes/blow-studio/work"));

// axis-studios
router.get("/axis-studios/:type/:tag?", lazyRequire("./routes/axis-studios/work"));

// 人民邮电出版社
router.get("/ptpress/book/:type?", lazyRequire("./routes/ptpress/book"));

// uniqlo styling book
router.get("/uniqlo/stylingbook/:category?", lazyRequire("./routes/uniqlo/stylingbook"));

// 本地宝焦点资讯
router.get("/bendibao/news/:city", lazyRequire("./routes/bendibao/news"));

// unit-image
router.get("/unit-image/films/:type?", lazyRequire("./routes/unit-image/films"));

// digic-picture
router.get("/digic-pictures/:menu/:tags?", lazyRequire("./routes/digic-pictures/index"));

// cve.mitre.org
router.get("/cve/search/:keyword", lazyRequire("./routes/cve/search"));

// Xposed Module Repository
router.get("/xposed/module/:mod", lazyRequire("./routes/xposed/module"));

// Microsoft Edge
router.get("/edge/addon/:crxid", lazyRequire("./routes/edge/addon"));

// 上海立信会计金融学院
router.get("/slu/tzgg/:id", lazyRequire("./routes/universities/slu/tzgg"));
router.get("/slu/jwc/:id", lazyRequire("./routes/universities/slu/jwc"));
router.get("/slu/tyyjkxy/:id", lazyRequire("./routes/universities/slu/tyyjkxy"));
router.get("/slu/kjxy/:id", lazyRequire("./routes/universities/slu/kjxy"));
router.get("/slu/xsc/:id", lazyRequire("./routes/universities/slu/xsc"));
router.get("/slu/csggxy/:id", lazyRequire("./routes/universities/slu/csggxy"));

// Ruby China
router.get("/ruby-china/topics/:type?", lazyRequire("./routes/ruby-china/topics"));
router.get("/ruby-china/jobs", lazyRequire("./routes/ruby-china/jobs"));

// 中国人事考试网
router.get("/cpta/notice", lazyRequire("./routes/cpta/notice"));

// 广告网
router.get("/adquan/:type?", lazyRequire("./routes/adquan/index"));

// 齐鲁晚报
router.get("/qlwb/news", lazyRequire("./routes/qlwb/news"));
router.get("/qlwb/city/:city", lazyRequire("./routes/qlwb/city"));

// 蜻蜓FM
router.get("/qingting/channel/:id", lazyRequire("./routes/qingting/channel"));

// 金色财经
router.get("/jinse/lives", lazyRequire("./routes/jinse/lives"));
router.get("/jinse/timeline", lazyRequire("./routes/jinse/timeline"));
router.get("/jinse/catalogue/:caty", lazyRequire("./routes/jinse/catalogue"));

// deeplearning.ai
router.get("/deeplearningai/thebatch", lazyRequire("./routes/deeplearningai/thebatch"));

// Fate Grand Order
router.get("/fgo/news", lazyRequire("./routes/fgo/news"));

// RF技术社区
router.get("/rf/article", lazyRequire("./routes/rf/article"));

// University of Massachusetts Amherst
router.get("/umass/amherst/ecenews", lazyRequire("./routes/umass/amherst/ecenews"));
router.get("/umass/amherst/csnews", lazyRequire("./routes/umass/amherst/csnews"));
router.get("/umass/amherst/ipoevents", lazyRequire("./routes/umass/amherst/ipoevents"));
router.get("/umass/amherst/ipostories", lazyRequire("./routes/umass/amherst/ipostories"));

// 飘花电影网
router.get("/piaohua/hot", lazyRequire("./routes/piaohua/hot"));

// 快媒体
router.get("/kuai", lazyRequire("./routes/kuai/index"));
router.get("/kuai/:id", lazyRequire("./routes/kuai/id"));

// 生物帮
router.get("/biobio/:id", lazyRequire("./routes/biobio/index"));
router.get("/biobio/:column/:id", lazyRequire("./routes/biobio/others"));

// 199it
router.get("/199it", lazyRequire("./routes/199it/index"));
router.get("/199it/category/:caty", lazyRequire("./routes/199it/category"));
router.get("/199it/tag/:tag", lazyRequire("./routes/199it/tag"));

// 唧唧堂
router.get("/jijitang/article/:id", lazyRequire("./routes/jijitang/article"));
router.get("/jijitang/publication", lazyRequire("./routes/jijitang/publication"));

// 新闻联播
router.get("/xwlb", lazyRequire("./routes/xwlb/index"));

// 网易新闻专栏
router.get("/netease/news/special/:type?", lazyRequire("./routes/netease/news/special"));

// 端传媒
router.get("/initium/:type?/:language?", lazyRequire("./routes/initium/full"));
router.get("/theinitium/:model/:type?/:language?", lazyRequire("./routes/initium/full"));

// Grub Street
router.get("/grubstreet", lazyRequire("./routes/grubstreet/index"));

// 漫画堆
router.get("/manhuadui/manhua/:name/:serial?", lazyRequire("./routes/manhuadui/manhua"));

// 风之漫画
router.get("/fzdm/manhua/:id", lazyRequire("./routes/fzdm/manhua"));

// Aljazeera 半岛网
router.get("/aljazeera/news", lazyRequire("./routes/aljazeera/news"));

// CFD indices dividend adjustment
router.get("/cfd/gbp_div", lazyRequire("./routes/cfd/gbp_div"));

// 中国人民银行
router.get("/pbc/goutongjiaoliu", lazyRequire("./routes/pbc/goutongjiaoliu"));
router.get("/pbc/tradeAnnouncement", lazyRequire("./routes/pbc/tradeAnnouncement"));

// Monotype
router.get("/monotype/article", lazyRequire("./routes/monotype/article"));

// Stork
router.get("/stork/keyword/:trackID/:displayKey", lazyRequire("./routes/stork/keyword"));

// 致美化
router.get("/zhutix/latest", lazyRequire("./routes/zhutix/latest"));

// arXiv
router.get("/arxiv/:query", lazyRequire("./routes/arxiv/query"));

// 生物谷
router.get("/shengwugu/:uid?", lazyRequire("./routes/shengwugu/index"));

// 环球律师事务所文章
router.get("/law/hq", lazyRequire("./routes/law/hq"));

// 海问律师事务所文章
router.get("/law/hw", lazyRequire("./routes/law/hw"));

// 国枫律师事务所文章
router.get("/law/gf", lazyRequire("./routes/law/gf"));

// 通商律师事务所文章
router.get("/law/ts", lazyRequire("./routes/law/ts"));

// 锦天城律师事务所文章
router.get("/law/jtc", lazyRequire("./routes/law/jtc"));

// 中伦律师事务所文章
router.get("/law/zl", lazyRequire("./routes/law/zl"));

// 君合律师事务所文章
router.get("/law/jh", lazyRequire("./routes/law/jh"));

// 德恒律师事务所文章
router.get("/law/dh", lazyRequire("./routes/law/dh"));

// 金诚同达律师事务所文章
router.get("/law/jctd", lazyRequire("./routes/law/jctd"));

// Mobilism
router.get("/mobilism/release", lazyRequire("./routes/mobilism/release"));

// 三星盖乐世社区
router.get("/samsungmembers/latest", lazyRequire("./routes/samsungmembers/latest"));

// 东莞教研网
router.get("/dgjyw/:type", lazyRequire("./routes/dgjyw/index"));

// 中国信息通信研究院
router.get("/gov/caict/bps", lazyRequire("./routes/gov/caict/bps"));
router.get("/gov/caict/qwsj", lazyRequire("./routes/gov/caict/qwsj"));
router.get("/gov/caict/caictgd", lazyRequire("./routes/gov/caict/caictgd"));

// 中证网
router.get("/cs/news/:caty", lazyRequire("./routes/cs/news"));

// 财联社
router.get("/cls/telegraph", lazyRequire("./routes/cls/telegraph"));
router.get("/cls/depth", lazyRequire("./routes/cls/depth"));
router.get("/cls/depth/:caty", lazyRequire("./routes/cls/depth"));

// hentai-cosplays
router.get("/hentai-cosplays/:type?/:name?", lazyRequire("./routes/hentai-cosplays/hentai-cosplays"));
router.get("/porn-images-xxx/:type?/:name?", lazyRequire("./routes/hentai-cosplays/porn-images-xxx"));

// dcinside
router.get("/dcinside/board/:id", lazyRequire("./routes/dcinside/board"));

// 企鹅电竞
router.get("/egameqq/room/:id", lazyRequire("./routes/tencent/egame/room"));

// 国家税务总局
router.get("/gov/chinatax/latest", lazyRequire("./routes/gov/chinatax/latest"));

// 荔枝FM
router.get("/lizhi/user/:id", lazyRequire("./routes/lizhi/user"));

// 富途牛牛
router.get("/futunn/highlights", lazyRequire("./routes/futunn/highlights"));

// 外接大脑
router.get("/waijiedanao/article/:caty", lazyRequire("./routes/waijiedanao/article"));

// 即刻
router.get("/jike/topic/:id", lazyRequire("./routes/jike/topic"));
router.get("/jike/topic/text/:id", lazyRequire("./routes/jike/topicText"));
router.get("/jike/user/:id", lazyRequire("./routes/jike/user"));

// Boston.com
router.get("/boston/:tag?", lazyRequire("./routes/boston/index"));

// 中国邮政速递物流
router.get("/ems/news", lazyRequire("./routes/ems/news"));

// 场库
router.get("/changku", lazyRequire("./routes/changku/index"));
// SCMP
router.get("/scmp/:category_id", lazyRequire("./routes/scmp/index"));

// 上海市生态环境局
router.get("/gov/shanghai/sthj", lazyRequire("./routes/gov/shanghai/sthj"));

// 才符
router.get("/91ddcc/user/:user", lazyRequire("./routes/91ddcc/user"));
router.get("/91ddcc/stage/:stage", lazyRequire("./routes/91ddcc/stage"));

// BookwalkerTW热门新书
router.get("/bookwalkertw/news", lazyRequire("./routes/bookwalkertw/news"));

// Chicago Tribune
router.get("/chicagotribune/:category/:subcategory?", lazyRequire("./routes/chicagotribune/index"));

// Amazfit Watch Faces
router.get("/amazfitwatchfaces/fresh/:model/:type?/:lang?", lazyRequire("./routes/amazfitwatchfaces/fresh"));
router.get("/amazfitwatchfaces/updated/:model/:type?/:lang?", lazyRequire("./routes/amazfitwatchfaces/updated"));
router.get("/amazfitwatchfaces/top/:model/:type?/:time?/:sortBy?/:lang?", lazyRequire("./routes/amazfitwatchfaces/top"));
router.get("/amazfitwatchfaces/search/:model/:keyword?/:sortBy?", lazyRequire("./routes/amazfitwatchfaces/search"));

// 猫耳FM
router.get("/missevan/drama/:id", lazyRequire("./routes/missevan/drama"));

// Go语言爱好者周刊
router.get("/go-weekly", lazyRequire("./routes/go-weekly"));

// popiask提问箱
router.get("/popiask/:sharecode/:pagesize?", lazyRequire("./routes/popiask/questions"));

// AMD
router.get("/amd/graphicsdrivers/:id/:rid?", lazyRequire("./routes/amd/graphicsdrivers"));

// 二柄APP
router.get("/erbingapp/news", lazyRequire("./routes/erbingapp/news"));

// 电商报
router.get("/dsb/area/:area", lazyRequire("./routes/dsb/area"));

// 靠谱新闻
router.get("/kaopunews/all", lazyRequire("./routes/kaopunews/all"));

// Reuters
router.get("/reuters/theWire", lazyRequire("./routes/reuters/theWire"));

// 格隆汇
router.get("/gelonghui/user/:id", lazyRequire("./routes/gelonghui/user"));
router.get("/gelonghui/subject/:id", lazyRequire("./routes/gelonghui/subject"));
router.get("/gelonghui/keyword/:keyword", lazyRequire("./routes/gelonghui/keyword"));

// 光谷社区
router.get("/guanggoo/:caty", lazyRequire("./routes/guanggoo/index"));

// 万维读者
router.get("/creaders/headline", lazyRequire("./routes/creaders/headline"));

// 金山词霸
router.get("/iciba/:days?/:img_type?", lazyRequire("./routes/iciba/index"));

// 重庆市两江新区信息公开网
router.get("/gov/chongqing/ljxq/dwgk", lazyRequire("./routes/gov/chongqing/ljxq/dwgk"));
router.get("/gov/chongqing/ljxq/zwgk/:caty", lazyRequire("./routes/gov/chongqing/ljxq/zwgk"));

// 国家突发事件预警信息发布网
router.get("/12379", lazyRequire("./routes/12379/index"));

// 鸟哥笔记
router.get("/ngbj/today", lazyRequire("./routes/niaogebiji/today"));
router.get("/ngbj/cat/:cat", lazyRequire("./routes/niaogebiji/cat"));

// 梅花网
router.get("/meihua/shots/:caty", lazyRequire("./routes/meihua/shots"));
router.get("/meihua/article/:caty", lazyRequire("./routes/meihua/article"));

// 看点快报
router.get("/kuaibao", lazyRequire("./routes/kuaibao/index"));

// SocialBeta
router.get("/socialbeta/home", lazyRequire("./routes/socialbeta/home"));
router.get("/socialbeta/hunt", lazyRequire("./routes/socialbeta/hunt"));

// 东方我乐多丛志
router.get("/touhougarakuta/:language/:type", lazyRequire("./routes/touhougarakuta"));

// 猎趣TV
router.get("/liequtv/room/:id", lazyRequire("./routes/liequtv/room"));

// Behance
router.get("/behance/:user/:type?", lazyRequire("./routes/behance/index"));

// furstar.jp
router.get("/furstar/characters/:lang?", lazyRequire("./routes/furstar/index"));
router.get("/furstar/artists/:lang?", lazyRequire("./routes/furstar/artists"));
router.get("/furstar/archive/:lang?", lazyRequire("./routes/furstar/archive"));

// 北京物资学院
router.get("/bwu/news", lazyRequire("./routes/universities/bwu/news"));

// Picuki
router.get("/picuki/profile/:id/:displayVideo?", lazyRequire("./routes/picuki/profile"));

// 新榜
router.get("/newrank/wechat/:wxid", lazyRequire("./routes/newrank/wechat"));
router.get("/newrank/douyin/:dyid", lazyRequire("./routes/newrank/douyin"));

// 漫小肆
router.get("/manxiaosi/book/:id", lazyRequire("./routes/manxiaosi/book"));

// 吉林大学校内通知
router.get("/jlu/oa", lazyRequire("./routes/universities/jlu/oa"));

// 小宇宙
router.get("/xiaoyuzhou", lazyRequire("./routes/xiaoyuzhou/pickup"));

// 合肥工业大学
router.get("/hfut/tzgg", lazyRequire("./routes/universities/hfut/tzgg"));

// Darwin Awards
router.get("/darwinawards/all", lazyRequire("./routes/darwinawards/articles"));

// 四川职业技术学院
router.get("/scvtc/xygg", lazyRequire("./routes/universities/scvtc/xygg"));

// 华南理工大学土木与交通学院
router.get("/scut/scet/notice", lazyRequire("./routes/universities/scut/scet/notice"));

// OneJAV
router.get("/onejav/:type/:key?", lazyRequire("./routes/onejav/one"));

// CuriousCat
router.get("/curiouscat/user/:id", lazyRequire("./routes/curiouscat/user"));

// Telecompaper
router.get("/telecompaper/news/:caty/:year?/:country?/:type?/:keyword?", lazyRequire("./routes/telecompaper/news"));

// 水木社区
router.get("/newsmth/account/:id", lazyRequire("./routes/newsmth/account"));
router.get("/newsmth/section/:section", lazyRequire("./routes/newsmth/section"));

// Kotaku
router.get("/kotaku/story/:type", lazyRequire("./routes/kotaku/story"));

// 梅斯医学
router.get("/medsci/recommend", lazyRequire("./routes/medsci/recommend"));

// Wallpaperhub
router.get("/wallpaperhub", lazyRequire("./routes/wallpaperhub/index"));

// 悟空问答
router.get("/wukong/user/:id/:type?", lazyRequire("./routes/wukong/user"));

// 腾讯大数据
router.get("/tencent/bigdata", lazyRequire("./routes/tencent/bigdata/index"));

// 搜韵网
router.get("/souyun/today", lazyRequire("./routes/souyun/today"));

// 生物谷
router.get("/bioon/latest", lazyRequire("./routes/bioon/latest"));

// soomal
router.get("/soomal/topics/:category/:language?", lazyRequire("./routes/soomal/topics"));

// NASA
router.get("/nasa/apod", lazyRequire("./routes/nasa/apod"));
router.get("/nasa/apod-ncku", lazyRequire("./routes/nasa/apod-ncku"));
router.get("/nasa/apod-cn", lazyRequire("./routes/nasa/apod-cn"));

// 爱Q生活网
router.get("/iqshw/latest", lazyRequire("./routes/3k8/latest"));
router.get("/3k8/latest", lazyRequire("./routes/3k8/latest"));

// JustRun
router.get("/justrun", lazyRequire("./routes/justrun/index"));

// 上海电力大学
router.get("/shiep/:type", lazyRequire("./routes/universities/shiep/index"));

// 福建新闻
router.get("/fjnews/:city/:limit", lazyRequire("./routes/fjnews/fznews"));
router.get("/fjnews/jjnews", lazyRequire("./routes/fjnews/jjnews"));

// 中山网新闻
router.get("/zsnews/index/:cateid", lazyRequire("./routes/zsnews/index"));

// 孔夫子旧书网
router.get("/kongfz/people/:id", lazyRequire("./routes/kongfz/people"));
router.get("/kongfz/shop/:id/:cat?", lazyRequire("./routes/kongfz/shop"));

// XMind
router.get("/xmind/mindmap/:lang?", lazyRequire("./routes/xmind/mindmap"));

// 小刀娱乐网
router.get("/x6d/:id?", lazyRequire("./routes/x6d/index"));

// 思维导图社区
router.get("/edrawsoft/mindmap/:classId?/:order?/:sort?/:lang?/:price?/:search?", lazyRequire("./routes/edrawsoft/mindmap"));

// 它惠网
router.get("/tahui/rptlist", lazyRequire("./routes/tahui/rptlist"));

// Guiltfree
router.get("/guiltfree/onsale", lazyRequire("./routes/guiltfree/onsale"));

// 消费明鉴
router.get("/mingjian", lazyRequire("./routes/mingjian/index"));

// hentaimama
router.get("/hentaimama/videos", lazyRequire("./routes/hentaimama/videos"));

router.get("/internal/rss-route-info", async (ctx) => {
  ctx.body = router.stack.map((item) => item.path);
});
// 文学城博客
// 无讼
router.get("/itslaw/judgements/:conditions", lazyRequire("./routes/itslaw/judgements"));

// 文学城
router.get("/wenxuecity/blog/:id", lazyRequire("./routes/wenxuecity/blog"));
router.get("/wenxuecity/bbs/:cat/:elite?", lazyRequire("./routes/wenxuecity/bbs"));
router.get("/wenxuecity/hot/:cid", lazyRequire("./routes/wenxuecity/hot"));
router.get("/wenxuecity/news", lazyRequire("./routes/wenxuecity/news"));

// 不安全
router.get("/buaq", lazyRequire("./routes/buaq/index"));

// 快出海
router.get("/kchuhai", lazyRequire("./routes/kchuhai/index"));

// i春秋资讯
router.get("/ichunqiu", lazyRequire("./routes/ichunqiu/index"));

// 冰山博客
router.get("/bsblog123", lazyRequire("./routes/bsblog123/index"));

// 纳威安全导航
router.get("/navisec", lazyRequire("./routes/navisec/index"));

// 安全师
router.get("/secshi", lazyRequire("./routes/secshi/index"));

// 出海笔记
router.get("/chuhaibiji", lazyRequire("./routes/chuhaibiji/index"));

// 建宁闲谈
router.get("/blogs/jianning", lazyRequire("./routes/blogs/jianning"));

// 妖火网
router.get("/yaohuo/:type?", lazyRequire("./routes/yaohuo/index"));

// 互动吧
router.get("/hudongba/:city/:id", lazyRequire("./routes/hudongba/index"));

// 差评
router.get("/chaping/banner", lazyRequire("./routes/chaping/banner"));
router.get("/chaping/news/:caty?", lazyRequire("./routes/chaping/news"));

// 飞雪娱乐网
router.get("/feixuew/:id?", lazyRequire("./routes/feixuew/index"));

// 1X
router.get("/1x/:type?/:caty?", lazyRequire("./routes/1x/index"));

// 剑网3
router.get("/jx3/:caty?", lazyRequire("./routes/jx3/news"));

// GQ
router.get("/gq/tw/:caty?/:subcaty?", lazyRequire("./routes/gq/tw/index"));

// 泉州市跨境电子商务协会
router.get("/qzcea/:caty?", lazyRequire("./routes/qzcea/index"));

// 福利年
router.get("/fulinian/:caty?", lazyRequire("./routes/fulinian/index"));

// CGTN
router.get("/cgtn/most/:type?/:time?", lazyRequire("./routes/cgtn/most"));

// AppSales
router.get("/appsales/:caty?/:time?", lazyRequire("./routes/appsales/index"));

// CGTN
router.get("/cgtn/top", lazyRequire("./routes/cgtn/top"));

// Academy of Management
router.get("/aom/journal/:id", lazyRequire("./routes/aom/journal"));

// 巴哈姆特電玩資訊站
router.get("/gamer/hot/:bsn", lazyRequire("./routes/gamer/hot"));

// iCity
router.get("/icity/:id", lazyRequire("./routes/icity/index"));

// Anki
router.get("/anki/changes", lazyRequire("./routes/anki/changes"));

// ABC News
router.get("/abc/:site?", lazyRequire("./routes/abc/index.js"));

// 台湾中央通讯社
router.get("/cna/:id?", lazyRequire("./routes/cna/index"));

// 华为心声社区
router.get("/huawei/xinsheng/:caty?/:order?/:keyword?", lazyRequire("./routes/huawei/xinsheng/index"));

// 守望先锋
router.get("/ow/patch", lazyRequire("./routes/ow/patch"));

// MM范
router.get("/95mm/tab/:tab?", lazyRequire("./routes/95mm/tab"));
router.get("/95mm/tag/:tag", lazyRequire("./routes/95mm/tag"));
router.get("/95mm/category/:category", lazyRequire("./routes/95mm/category"));

// 中国工程科技知识中心
router.get("/cktest/app/:ctgroup?/:domain?", lazyRequire("./routes/cktest/app"));
router.get("/cktest/policy", lazyRequire("./routes/cktest/policy"));

// 妈咪帮
router.get("/mamibuy/:caty?/:age?/:sort?", lazyRequire("./routes/mamibuy/index"));

// Mercari
router.get("/mercari/:type/:id", lazyRequire("./routes/mercari/index"));

// notefolio
router.get("/notefolio/:caty?/:order?/:time?/:query?", lazyRequire("./routes/notefolio/index"));

// JavDB
router.get("/javdb/home/:caty?/:sort?/:filter?", lazyRequire("./routes/javdb/home"));
router.get("/javdb/search/:keyword?/:filter?", lazyRequire("./routes/javdb/search"));
router.get("/javdb/tags/:query?/:caty?", lazyRequire("./routes/javdb/tags"));
router.get("/javdb/actors/:id/:filter?", lazyRequire("./routes/javdb/actors"));
router.get("/javdb/makers/:id/:filter?", lazyRequire("./routes/javdb/makers"));
router.get("/javdb/series/:id/:filter?", lazyRequire("./routes/javdb/series"));
router.get("/javdb/rankings/:caty?/:time?", lazyRequire("./routes/javdb/rankings"));

// World Economic Forum
router.get("/weforum/report/:lang?/:year?/:platform?", lazyRequire("./routes/weforum/report"));

// Nobel Prize
router.get("/nobelprize/:caty?", lazyRequire("./routes/nobelprize/index"));

// 中華民國國防部
router.get("/gov/taiwan/mnd", lazyRequire("./routes/gov/taiwan/mnd"));

// 読売新聞
router.get("/yomiuri/:category", lazyRequire("./routes/yomiuri/news"));

// 巴哈姆特
// GNN新闻
router.get("/gamer/gnn/:category?", lazyRequire("./routes/gamer/gnn_index"));

// 中国人大网
router.get("/npc/:caty", lazyRequire("./routes/npc/index"));

// 高科技行业门户
router.get("/ofweek/news", lazyRequire("./routes/ofweek/news"));

// eventernote
router.get("/eventernote/actors/:name/:id", lazyRequire("./routes/eventernote/actors"));

// 八阕
router.get("/popyard/:caty?", lazyRequire("./routes/popyard/index"));

// 原神
router.get("/yuanshen/:location?/:category?", lazyRequire("./routes/yuanshen/index"));

// World Trade Organization
router.get("/wto/dispute-settlement/:year?", lazyRequire("./routes/wto/dispute-settlement"));

module.exports = router;
