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
      pubDate: moment($("header > .post-info > .thetime.updated span").text(), "YYYY/MM/DD"),
      author: $(".theauthor a").text(),
      description: content.html(),
    };
  },
});
