const got = require("@/utils/got");
const cheerio = require("cheerio");
const moment = require("moment");

module.exports = async (ctx) => {
  const response = await got({
    method: "get",
    url: "https://ak.hypergryph.com/news.html",
  });

  const $ = cheerio.load(response.data);
  const newslist = $(
    "div.articleContainer.articleContainer > div.articleListWrapper li.articleItem",
  ).slice(0, 10);

  const items = await Promise.all(
    newslist
      .map(async (index, item) => {
        const sth = $(item);
        const link = `https://ak.hypergryph.com/${sth.find("a").attr("href").slice(1)}`;
        return await ctx.cache.tryGet(link, async () => {
          const result = await got.get(link);
          const $ = cheerio.load(result.data);

          const pubDate = moment(
            $(".article-date").text().slice(8),
            "YYYY-MM-DD",
          ).toDate();

          return {
            title: $(".article-title").text(),
            description: $(".article-content").html(),
            author: $(".article-author").text(),
            link,
            pubDate,
          };
        });
      })
      .get(),
  );

  ctx.state.data = {
    title: "《明日方舟》游戏公告与新闻",
    link: "https://ak.hypergryph.com/news.html",
    item: items,
  };
};
