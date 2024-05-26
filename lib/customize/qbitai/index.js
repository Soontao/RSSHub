const { createGenericEndpoint, linkExtractors } = require("@/utils/common-utils");

const endpoint = createGenericEndpoint({
  endpointPath: "/qbitai",
  entryUrl: "https://www.qbitai.com/category/%e8%b5%84%e8%ae%af",
  linkExtractor: linkExtractors.domAElementLinkExtractor(".text_box h4 a"),
  contentExtractor: ($) => {
    const { trimEnd } = require("@newdash/newdash");
    const moment = require("moment");
    const date = $(".article_info .date").text();
    const time = $(".article_info .time").text();
    const author = $(".article_info .author").text();
    const title = trimEnd($("title").text(), " | 量子位");
    const pubDate = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm:ss").toISOString();
    const article = $("article, .article");
    article.find("h1").remove();
    article.find(".article_info").remove();
    article.find(".zhaiyao").remove();
    article.find("blockquote").remove();
    const description = article.html().trim();
    return { title, pubDate, author, description };
  },
});

module.exports = endpoint;
