const { createGenericEndpoint, linkExtractors, contentExtractors } = require("rss-libs/utils/common-utils");
const { fetchTextWithCrossWallProxy } = require("rss-libs/utils/http");

const endpoint = createGenericEndpoint({
  endpointPath: "/hacker-news",
  entryUrl: "https://news.ycombinator.com",
  maxItemsInList: 10,
  linkExtractor: linkExtractors.domAElementLinkExtractor("table td.title span.titleline > a"),
  contentExtractor: contentExtractors.jsContentExtractor,
});

module.exports = endpoint;
