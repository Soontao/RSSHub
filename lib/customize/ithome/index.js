const moment = require("moment");
const { createGenericEndpoint } = require("@/utils/common-utils");
const { trimPrefix } = require("@newdash/newdash");

module.exports = createGenericEndpoint({
  feedTitle: "IT之家",
  endpointPath: "/ithome/it",
  entryUrl: "https://m.ithome.com/",
  linkExtractor: ($) =>
    $(".content div.one-img-plc a")
      .filter(
        (_, item) => $(item).find("span:contains(广告), span:contains(置顶)").length === 0 && $(item).find("span.post-time").length > 0
      )
      .map((_, item) => $(item).attr("href"))
      .get(),
  contentExtractor: ($) => {
    $("p img").each((_, item) => {
      $(item).attr("src", $(item).attr("data-original"));
    });
    $(".list-paddingleft-2").remove();
    $(".card.main-site").remove();

    return {
      title: $("h1").text(),
      description: $("div.news-content").html(),
      // 2024-06-10 20:03
      pubDate: moment($("span.news-time").text(), "YYYY-MM-DD HH:mm").toDate(),
      author: trimPrefix($("span.news-author")?.text?.(), "IT之家  - "),
    };
  },
  removeTexts: ["广告声明：文内含有的对外跳转链接", "点此抽今日红包"],
});
