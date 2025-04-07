const { createGenericEndpoint, linkExtractors, contentExtractors } = require("rss-libs/utils/common-utils");

const endpoint = createGenericEndpoint({
  endpointPath: "/cnn-international",
  entryUrl: "https://edition.cnn.com",
  skipPure: true,
  maxItemsInList: 25,
  concurrency: 5,
  linkExtractor: linkExtractors.domAElementLinkExtractor(
    "a.container__title-url, a.container__link--type-article",
    "https://edition.cnn.com"
  ),
  contentExtractor: contentExtractors.jsContentExtractor,
  language: "en",
});

module.exports = endpoint;
