const { GenericEndpointBuilder } = require("rss-libs/utils/common-utils");

const endpoint = GenericEndpointBuilder.new()
  .withEndpointPath("/example")
  .withEntryUrl("https://www.qbitai.com/")
  .withDomAEleLinkExtractor(".text_box h4 a")
  .withContentExtractor(($) => {
    const moment = require("moment");
    const date = $(".article_info .date").text();
    const time = $(".article_info .time").text();
    const author = $(".article_info .author").text();
    const title = $("title").text();
    const pubDate = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").toISOString();
    const description = $("article, .article").html();
    return { title, pubDate, author, description };
  })
  .build();

module.exports = endpoint;
