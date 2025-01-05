const { GenericEndpointBuilder } = require("rss-libs/utils/common-utils");
const moment = require("moment");

const endpoint = GenericEndpointBuilder.new()
  .withEndpointPath("/cmu/pavlo")
  .withEntryUrl("https://www.cs.cmu.edu/~pavlo/blog/index.html")
  .withDomAEleLinkExtractor("h4 a")
  .withAutoContentExtractor()
  .withContentExtractor(($) => ({
    // 'Posted on October 03, 2016'
    pubDate: moment($(".postdate",).text()?.slice('Posted on '.length), "MMMM DD, YYYY").toISOString(),
  }))
  .build();

module.exports = endpoint;
