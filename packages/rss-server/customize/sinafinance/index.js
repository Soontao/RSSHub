const { GenericEndpointBuilder } = require("rss-libs/utils/common-utils");

const endpoint = GenericEndpointBuilder.new()
  .withEndpointPath("/news/sina/finance")
  .withEntryUrl("https://finance.sina.com.cn")
  .withDomAEleLinkExtractor("ul.m-list li a")
  .withRemoveSelectors(["#artibody .appendQr_wrap", "#artibody style", "#artibody script"])
  .withAutoContentExtractor()
  .build();

module.exports = endpoint;
