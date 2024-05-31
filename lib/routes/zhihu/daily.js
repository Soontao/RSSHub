// 参考：https://github.com/izzyleung/ZhihuDailyPurify/wiki/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5-API-%E5%88%86%E6%9E%90
// 文章给出了v4版 api的信息，包含全文api

module.exports = async (ctx) => {
  const moment = require("moment");
  const cheerio = require("cheerio");
  const md5 = require("@/utils/md5");
  const fetchText = require("@/utils/http").fetchText;

  const listResText = await fetchText("https://news-at.zhihu.com/api/4/news/latest");
  const listRes = JSON.parse(listResText);
  const pubDate = moment(listRes.date, "YYYYMMDD").toISOString();

  // 根据api的说明，过滤掉极个别站外链接
  const storyList = listRes.stories.filter((el) => el.type === 0);

  const item = await Promise.all(
    storyList.map(async (story) => {
      const link = "https://daily.zhihu.com/story/" + story.id;
      const storyDetail = await ctx.cache.tryGet(link, async () => fetchText(link));
      const $ = cheerio.load(storyDetail);
      const description = $(".answer").html();
      const author = $(".meta span.author").text().replace(/，/, "") ?? "知乎日报";
      const item = {
        title: story.title,
        description,
        author,
        hash: md5(link),
        link,
        pubDate,
      };

      return item;
    })
  );

  ctx.state.data = {
    title: "知乎日报",
    link: "https://daily.zhihu.com",
    description: "每天3次, 每次7分钟",
    item,
  };
};
