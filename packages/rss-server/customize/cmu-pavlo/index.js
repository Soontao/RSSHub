const { GenericEndpointBuilder } = require("rss-libs/utils/common-utils");

const endpoint = GenericEndpointBuilder.new()
  .withEndpointPath("/cmu/pavlo")
  .withEntryUrl("https://www.cs.cmu.edu/~pavlo/blog/index.html")
  .withDomAEleLinkExtractor("h4 a")
  .withAutoContentExtractor()
  .build();

module.exports = endpoint;
