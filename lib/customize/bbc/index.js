const { createGenericEndpoint, linkExtractors, contentExtractors } = require("@/utils/common-utils");
const { fetchTextWithCrossWallProxy } = require("@/utils/http");

const endpoint = createGenericEndpoint({
  feedTitle: "BBC News",
  endpointPath: "/bbc-news",
  translateTitle: true,
  language: "en",
  entryUrl: "https://feeds.bbci.co.uk/news/rss.xml",
  fetchText: fetchTextWithCrossWallProxy,
  linkExtractor: linkExtractors.feedXmlLinkExtractor(),
  contentExtractor: contentExtractors.js,
});

module.exports = endpoint;
