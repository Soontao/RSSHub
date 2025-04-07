const { createGenericEndpoint, linkExtractors } = require("rss-libs/utils/common-utils");

const endpoint = createGenericEndpoint({
  endpointPath: "/cnn-business",
  entryUrl: "https://edition.cnn.com/business",
  skipPure: true,
  maxItemsInList: 10,
  concurrency: 3,
  linkExtractor: linkExtractors.domAElementLinkExtractor("a.container__link--type-article", "https://edition.cnn.com"),
  contentExtractor: async ($) => {
    const moment = require("moment");
    const author = $(".byline__name").text().trim();
    const title = $("h1").text().trim();
    const pubDate = moment($(".timestamp").text().trim().slice("Updated ".length), "h:mm A z, ddd MMMM D, YYYY").toISOString();
    const description = $("main.article__main").html().trim();
    return { title, pubDate, author, description };
  },
});

module.exports = endpoint;
