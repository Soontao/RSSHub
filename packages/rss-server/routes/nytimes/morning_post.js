const got = require("rss-libs/utils/got");
const cheerio = require("cheerio");
const utils = require("./utils");

module.exports = async (ctx) => {
  const url = "https://m.cn.nytimes.com/morning-brief/";
  const response = await got({
    method: "get",
    url,
  });
  const data = response.data;
  const $ = cheerio.load(data);
  const post = $(".article-list .regular-item")
    .map((index, elem) => {
      const $item = $(elem);
      const $link = $item.find("a");

      return {
        title: $link.attr("title"),
        link: $link.attr("href"),
      };
    })
    .get();

  const items = await Promise.all(
    post.map(async (item) => {
      const link = item.link;
      const result = await ctx.cache.tryGet(`nyt: ${link}`, async () => {
        const response = await got.get(link);

        return utils.ProcessFeed(response.data);
      });

      item.pubDate = result.pubDate;
      item.description = result.description;
      return Promise.resolve(item);
    }),
  );

  ctx.state.data = {
    title: "纽约时报 每日简报",
    link: url,
    item: items,
  };
};
