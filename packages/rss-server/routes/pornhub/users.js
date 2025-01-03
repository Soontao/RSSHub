const got = require("rss-libs/utils/got");
const cheerio = require("cheerio");

module.exports = async (ctx) => {
  const username = ctx.params.username;
  const link = `https://www.pornhub.com/users/${username}/videos`;

  const response = await got.get(link);
  const $ = cheerio.load(response.data);
  const list = $(".videoUList .videoBox");

  ctx.state.data = {
    title: $("title").first().text(),
    link: link,
    item:
      list &&
      list
        .map((_, e) => {
          e = $(e);

          return {
            title: e.find("span.title a").text(),
            link:
              "https://www.pornhub.com" + e.find("span.title a").attr("href"),
            description: `<img src="${e.find("img.thumb").attr("data-thumb_url")}">`,
          };
        })
        .get(),
  };
};
