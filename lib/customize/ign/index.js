const { createGenericEndpoint, linkExtractors, contentExtractors } = require("@/utils/common-utils");

const endpoint = createGenericEndpoint({
  endpointPath: "/ign",
  feedTitle: "IGN中国",
  entryUrl: "https://www.ign.com.cn/article/review",
  linkExtractor: linkExtractors.domAElementLinkExtractor(".broll article h3 a"),
  contentExtractor: contentExtractors.js,
});

module.exports = endpoint;
