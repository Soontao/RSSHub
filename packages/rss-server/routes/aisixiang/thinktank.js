const got = require("rss-libs/utils/got");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const util = require("./utils");

module.exports = async (ctx) => {
  const { name, type = "lunw" } = ctx.params;

  const host = `http://www.aisixiang.com/thinktank/${name}.html`;

  const response = await got.get(host, {
    responseType: "buffer",
  });
  response.data = iconv.decode(response.data, "gbk");

  const $ = cheerio.load(response.data);

  const tds = $("td > img").filter(function () {
    return $(this).attr("src") === `images/${type}.gif`;
  });
  if (tds.length === 0) {
    throw `Type Not Found - ${type}`;
  }

  const list = tds.parent().next().find("a").slice(0, 5).get();

  const items = await Promise.all(
    list.map(async (e) => {
      const link = $(e).attr("href");
      return await ctx.cache.tryGet(
        link,
        async () => await util.ProcessFeed(link),
      );
    }),
  );

  ctx.state.data = {
    title: $("title").text(),
    link: host,
    description: $('meta[name="description"]').attr("content"),
    item: items,
  };
};
