const got = require("rss-libs/utils/got");
const cheerio = require("cheerio");
const moment = require("moment");
const { removeHTMLComments } = require("rss-libs/utils/html");

module.exports = async (ctx) => {
  const url =
    "http://feed.sina.com.cn/api/roll/get?pageid=155&lid=1686&num=20&versionNumber=1.2.8&page=1&encode=utf-8";
  const response = await got.get(url);
  const list = response.data.result.data;

  let out = await Promise.all(
    list.map(async (data) => {
      const title = data.title;
      const link = data.url;

      return await ctx.cache.tryGet(`sina-finance: ${link}`, async () => {
        const response = await got.get(link);
        const $ = cheerio.load(response.data);

        $("#artibody .appendQr_wrap").remove(); // remove qr code
        $("#artibody style").remove(); // remove style
        $("#artibody script").remove(); // remove script

        removeHTMLComments($);

        const sDate = $(".date").text();

        return {
          title: title,
          link,
          description: $("#artibody").html(),
          author: $(".source.ent-source").text(),
          // 2020年08月31日 12:56
          pubDate: moment(sDate, "YYYY年MM月DD日 hh:mm").toISOString(),
        };
      });
    }),
  );

  out = out.filter(item => moment(item.pubDate).isBefore(moment().subtract(15, 'minutes')))

  ctx.state.data = {
    title: "新浪财经－国內",
    link: "http://finance.sina.com.cn/china/",
    item: out,
  };
};
