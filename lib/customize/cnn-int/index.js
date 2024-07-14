const { createGenericEndpoint, linkExtractors, contentExtractors } = require("@/utils/common-utils");
const { fetchTextWithCrossWallProxy } = require("@/utils/http");

const endpoint = createGenericEndpoint({
  endpointPath: "/cnn-international",
  entryUrl: "https://edition.cnn.com",
  skipPure: true,
  translateTitle: true,
  maxItemsInList: 25,
  concurrency: 5,
  fetchText: fetchTextWithCrossWallProxy,
  linkExtractor: linkExtractors.domAElementLinkExtractor(
    "a.container__title-url, a.container__link--type-article",
    "https://edition.cnn.com"
  ),
  contentExtractor: contentExtractors.jsContentExtractor,
});

module.exports = endpoint;
