const { createGenericEndpoint, linkExtractors, contentExtractors } = require("rss-libs/utils/common-utils");
const { fetchTextWithCrossWallProxy } = require("rss-libs/utils/http");

const endpoint = createGenericEndpoint({
  feedTitle: "BBC News",
  endpointPath: "/bbc-news",
  entryUrl: "https://feeds.bbci.co.uk/news/rss.xml",
  linkExtractor: linkExtractors.feedXmlLinkExtractor(),
  contentExtractor: contentExtractors.js,
});

module.exports = endpoint;
