const { createGenericEndpoint } = require("rss-libs/utils/common-utils");
const { trimEnd } = require("@newdash/newdash");
const moment = require("moment");

module.exports = createGenericEndpoint({
  endpointPath: "/3dm/news",
  entryUrl: "http://www.3dmgame.com/news/",
  feedTitle: "3DM游戏网",
  maxItemsInList: 5,
  linkExtractor: ($) =>
    $(".Revision_list .selectpost")
      .get()
      .map((i) => $(i).find(".text").find("a").attr("href")),
  contentExtractor: ($) => {
    const title = trimEnd($("title").text(), "_3DM单机");
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
