const got = require("rss-libs/utils/got");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
  const link = "http://www.gov.cn/zhengce/zuixin.htm";
  const listData = await got.get(link);
  const $list = cheerio.load(listData.data);
  ctx.state.data = {
    title: "最新政策 - 中国政府网",
    link,
    item: await Promise.all(
      $list(".news_box .list li:not(.line)")
        .map(async (_, el) => {
          const $el = $list(el);
          const $a = $el.find("h4 a");
          const href = $a.attr("href");
          const link = href.startsWith("/zhengce")
            ? `http://www.gov.cn${href}`
            : href;
          const key = `gov_zhengce_zuixin: ${link}`;
          let description;
          const value = await ctx.cache.get(key);

          if (value) {
            description = value;
          } else {
            const contentData = await got.get(link);
            const $content = cheerio.load(contentData.data);
            description = $content("#UCAP-CONTENT").html();
            ctx.cache.set(key, description);
          }

          return {
            title: $a.text(),
            description,
            guid: href,
            link,
            pubDate: new Date($el.find(".date").text()).toUTCString(),
          };
        })
        .get(),
    ),
  };
};
