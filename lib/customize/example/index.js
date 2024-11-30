const { createGenericEndpoint, linkExtractors } = require("rss-libs/utils/common-utils");

const endpoint = createGenericEndpoint({
  endpointPath: "/example",
  entryUrl: "https://www.qbitai.com/",
  linkExtractor: linkExtractors.domAElementLinkExtractor(".text_box h4 a"),
  contentExtractor: ($) => {
    const moment = require("moment");
    const date = $(".article_info .date").text();
    const time = $(".article_info .time").text();
    const author = $(".article_info .author").text();
    const title = $("title").text();
    const pubDate = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").toISOString();
    const description = $("article, .article").html();
    return { title, pubDate, author, description };
  },
});

module.exports = endpoint;
