const { createGenericEndpoint, linkExtractors } = require("rss-libs/utils/common-utils");
const moment = require("moment");

const endpoint = createGenericEndpoint({
  feedTitle: "国务院信息",
  endpointPath: "/gov/gwy",
  entryUrl: "https://www.gov.cn/pushinfo/v150203/index.htm",
  linkExtractor: linkExtractors.domAElementLinkExtractor(".news_box h4 a"),
  contentExtractor: ($) => {
    let pubDate = moment(
      $(".mxxgkwrap_gwywj table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(4)").text(),
      "YYYY年MM月DD日"
    );

    if (!pubDate.isValid()) {
      // 2024-10-21 18:14
      pubDate = moment($("div.pages-date").text().trim().slice(0, 16), "YYYY-MM-DD HH:mm");
    }
    const title = $(".mxxgkwrap_gwywj table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2), #ti").text();

    return {
      title,
      description: $(".mxxgkwrap_gwywj, div.pages_content").html(),
      pubDate: pubDate.toDate(),
      author: $(".mxxgkwrap_gwywj table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2)").text(),
    };
  },
});

module.exports = endpoint;
