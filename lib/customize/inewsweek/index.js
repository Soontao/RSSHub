const { createGenericEndpoint, linkExtractors } = require("@/utils/common-utils");

const endpoint = createGenericEndpoint({
  endpointPath: "/inewsweek",
  entryUrl: "https://news.inewsweek.cn/cover/",
  encoding: "gb2312",
  feedTitle: "中国新闻周刊",
  linkExtractor: linkExtractors.domAElementLinkExtractor(".grid-item a", "https://news.inewsweek.cn"),
  contentExtractor: ($) => {
    const moment = require("moment");
    const editorInfo = $("div.editor").text();
    // 'editor_name 2024-05-16 14:21:56'
    const dateTime = editorInfo.slice(editorInfo.length - 19);
    const author = editorInfo.slice(0, editorInfo.length - 20).trim();
    const title = $("title").text();
    const pubDate = moment(dateTime, "YYYY-MM-DD HH:mm:ss").toISOString();
    const description = $(".contenttxt").html();
    return { title, pubDate, author, description };
  },
});

module.exports = endpoint;
