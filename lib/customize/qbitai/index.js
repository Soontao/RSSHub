require("@/customize/type");
const moment = require("moment");
const { createGenericEndpoint, linkExtractors } = require("@/utils/common-utils");
const { trimEnd } = require("@newdash/newdash");

const endpoint = createGenericEndpoint({
  endpointPath: "/qbitai",
  entryUrl: "https://www.qbitai.com/category/%e8%b5%84%e8%ae%af",
  linkExtractor: linkExtractors.domAElementLinkExtractor(".text_box h4 a"),
  contentExtractor: ($) => {
    const date = $(".article_info .date").text();
    const time = $(".article_info .time").text();
    const author = $(".article_info .author").text();
    const title = trimEnd($("title").text(), " | 量子位");
    const pubDate = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").toISOString();
    const description = $("article, .article").html().trim();
    return { title, pubDate, author, description };
  },
});

module.exports = endpoint;
