const { createGenericEndpoint } = require("rss-libs/utils/common-utils");
const logger = require("rss-libs/utils/logger");
const moment = require("moment");

const endpoint = createGenericEndpoint({
  endpointPath: "/oschina/news",
  entryUrl: "https://www.oschina.net/news",
  linkExtractor: ($) =>
    $("div.news-item")
      .get()
      .map((listItem) => $(listItem).attr("data-url"))
      .filter((url) => url?.startsWith("https://www.oschina.net/news/")),
  contentExtractor: ($) => {
    const title = $("h1").text();
    const description = $("div.article-detail").html();
    const author = $("iv.article-box__header > div > div a").text();
    const pubDate = moment($("div.article-box__header > div > div > div:nth-child(3)").text());
    if (!title || !description) {
      logger.debug("no content founding for text", $.html());
      return undefined;
    }
    return {
      title,
      description,
      author,
      pubDate,
    };
  },
});

module.exports = endpoint;
