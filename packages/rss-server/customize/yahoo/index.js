const { createGenericEndpoint, linkExtractors, contentExtractors } = require("rss-libs/utils/common-utils");
const { fetchTextWithCrossWallProxy } = require("rss-libs/utils/http");

module.exports = createGenericEndpoint({
  entryUrl: "https://www.yahoo.com/news/",
  endpointPath: "/yahoo-news",
  maxItemsInList: 10,
  linkExtractor: linkExtractors.aLinkExtractor("a.js-content-viewer", "https://www.yahoo.com"),
  contentExtractor: contentExtractors.js,
});
