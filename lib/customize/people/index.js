const moment = require("moment");
const { createGenericEndpoint } = require("rss-libs/utils/common-utils");
const toDayBase = () => `http://paper.people.com.cn/rmrb/html/${moment().subtract(8, "hours").format("yyyy-MM/DD")}`;

const endpoint = createGenericEndpoint({
  endpointPath: "/people",
  // date example: "2024-05/23"
  entryUrl: () => `${toDayBase()}/nbs.D110000renmrb_01.htm`,
  linkExtractor: ($) =>
    $(".news-list li a")
      .get()
      .map((item) => toDayBase() + "/" + $(item).attr("href")),
  contentExtractor: ($) => {
    const article = $(".article");
    const title = article.find("h1").text();
    const author = "《人民日报》";
    // set time to zero
    const pubDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString();
    const description = article.find("#ozoom").html();
    return { title, pubDate, author, description };
  },
});

module.exports = endpoint;
