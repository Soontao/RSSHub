const { createGenericEndpoint } = require("rss-libs/utils/common-utils");

module.exports = createGenericEndpoint({
  endpointPath: "/news/chengdu",
  feedTitle: "成都市新闻门户网站",
  entryUrl: "https://www.chengdu.cn/",
  linkExtractor: ($) =>
    $(".main_left .mui-table-view a:nth-child(1)")
      .get()
      .map((listItem) => $(listItem).attr("href"))
      .filter((v) => v.includes("news.chengdu.cn")),
  contentExtractor: ($) => ({
    title: $("#main > h3").text(),
    description: $("#main > div.con-p2").html(),
    pubDate: $("#main > div.con-sj > span").text().trim().substring(0, 16),
    author: $("#main > div.con-sj > span > a").text(),
  }),
});
