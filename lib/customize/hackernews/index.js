const { createGenericEndpoint, linkExtractors, contentExtractors } = require("@/utils/common-utils");
const { fetchTextWithCrossWallProxy } = require("@/utils/http");

const endpoint = createGenericEndpoint({
  endpointPath: "/hacker-news",
  entryUrl: "https://news.ycombinator.com",
  maxItemsInList: 5,
  fetchText: fetchTextWithCrossWallProxy,
  linkExtractor: linkExtractors.domAElementLinkExtractor("table td.title span.titleline > a"),
  contentExtractor: contentExtractors.jsContentExtractor,
});

module.exports = endpoint;
