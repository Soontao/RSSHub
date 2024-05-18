const moment = require("moment");
const { createGenericEndpoint } = require("@/utils/common-utils");
const { trimEnd } = require("@newdash/newdash");

module.exports = createGenericEndpoint({
  feedTitle: "IT之家",
  endpointPath: "/ithome/it",
  entryUrl: "https://it.ithome.com/",
  linkExtractor: ($) =>
    $("#list > div.fl > ul > li > div > h2 > a")
      .map((_, item) => $(item).attr("href"))
      .get(),
  contentExtractor: ($) => ({
    title: trimEnd($("title").text(), " - IT之家 "),
    description: $("div#paragraph").html(),
    pubDate: moment($("span#pubtime_baidu").text(), "YYYY/M/DD h:mm:ss").toDate(),
    author: $("span#author_baidu strong")?.text?.(),
  }),
  removeTexts: ["广告声明：文内含有的对外跳转链接"],
});
