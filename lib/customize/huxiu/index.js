const { createGenericEndpoint, linkExtractors, contentExtractors } = require("@/utils/common-utils");

const endpoint = createGenericEndpoint({
  feedTitle: "虎嗅网",
  endpointPath: "/huxiu/article",
  entryUrl: "https://www.huxiu.com/article/",
  linkExtractor: linkExtractors.domAElementLinkExtractor(".card-container .article-item-wrap a.img-wrap"),
  contentExtractor: contentExtractors.js,
});

module.exports = endpoint;
