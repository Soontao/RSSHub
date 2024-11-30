const { createGenericEndpoint, linkExtractors, contentExtractors } = require("rss-libs/utils/common-utils");
const { fetchTextWithCrossWallProxy } = require("rss-libs/utils/http");

module.exports = createGenericEndpoint({
  entryUrl: "https://www.yahoo.com/news/",
  endpointPath: "/yahoo-news",
  translateTitle: true,
  maxItemsInList: 10,
  fetchText: fetchTextWithCrossWallProxy,
  linkExtractor: linkExtractors.aLinkExtractor("a.js-content-viewer", "https://www.yahoo.com"),
  contentExtractor: contentExtractors.js,
  language: "en",
});
