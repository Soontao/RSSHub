require("@/customize/type");
const moment = require("moment");
const { createGenericEndpoint, linkExtractors } = require("@/utils/common-utils");

const endpoint = createGenericEndpoint({
  endpointPath: "/qbitai",
  entryUrl: "https://www.qbitai.com/",
  linkExtractor: linkExtractors.domAElementLinkExtractor(".text_box h4 a"),
  contentExtractor: ($) => {
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
