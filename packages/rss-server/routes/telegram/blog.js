const cherrio = require("cheerio");
const got = require("rss-libs/utils/got");

module.exports = async (ctx, next) => {
  const link = "https://telegram.org/blog";

  const res = await got(link);
  const $$ = cherrio.load(res.body);

  const items = await Promise.all(
    $$(".dev_blog_card_link_wrap")
      .get()
      .map(async (each) => {
        const $ = $$(each);
        const link = "https://telegram.org" + $.attr("href");
        return await ctx.cache.tryGet(link, async () => {
          const result = await got(link);
          const $ = cherrio.load(result.body);
          return {
            title: $("#dev_page_title").text(),
            link,
            pubDate: new Date(
              $('[property="article:published_time"]').attr("content"),
            ).toUTCString(),
            description: $("#dev_page_content_wrap").html(),
          };
        });
      }),
  );

  ctx.state.data = {
    title: $$("title").text(),
    link,
    item: items,
  };
  await next();
};
