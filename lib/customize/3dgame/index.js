const { createGenericEndpoint } = require("@/utils/common-utils");
const moment = require("moment");

module.exports = createGenericEndpoint({
  endpointPath: "/3dm/news",
  entryUrl: "http://www.3dmgame.com/news/",
  linkExtractor: ($) =>
    $(".Revision_list .selectpost")
      .get()
      .map((i) => $(i).find(".text").find("a").attr("href")),
  contentExtractor: ($) => {
    const title = $("title").text();
    const description = $(".news_warp_center").html();
    const author = $("div.news_warp_top > ul span.name").text();
    // 2024-05-13 20:36:28
    const pubDate = moment($("div.time").text(), "YYYY-MM-DD HH:mm:ss").toISOString();

    return {
      title,
      description,
      pubDate,
      author,
    };
  },
});
