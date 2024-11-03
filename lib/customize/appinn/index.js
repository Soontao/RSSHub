const moment = require("moment");
const { createGenericEndpoint } = require("@/utils/common-utils");

module.exports = createGenericEndpoint({
  feedTitle: "小众软件",
  entryUrl: "https://www.appinn.com/",
  endpointPath: "/appinn",
  linkExtractor: ($) =>
    $(".post-data")
      .get()
      .filter((p) => $(p).find("span:contains('FD')").length === 0)
      .map((p) => $(p).find("a").attr("href")),
  contentExtractor: ($) => {
    const content = $(".post-single-content");
    content.find(".simplefavorite-button").remove();
    content.find(".wpulike").remove();

    return {
      title: $(".title").text(),
      // 2024-10-29T17:10:11+08:00
      pubDate: moment($("head > meta[property='article:published_time']").attr("content"), "YYYY-MM-DDTHH:mm:ssZ").toDate(),
      author: $(".theauthor a").text(),
      description: content.html(),
    };
  },
});
