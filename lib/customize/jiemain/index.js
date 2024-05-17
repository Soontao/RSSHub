const { createGenericEndpoint } = require("@/utils/common-utils");

module.exports = createGenericEndpoint({
  feedTitle: "界面新闻",
  entryUrl: "https://www.jiemian.com/",
  endpointPath: "/news/jiemian",
  linkExtractor: ($) =>
    $("a[content_type='article']")
      .map((_, item) => $(item).attr("content_id"))
      .get()
      .map((id) => `https://www.jiemian.com/article/${id}.html`),
  contentExtractor: ($) => {
    const { uniq } = require("@newdash/newdash");
    let pubDate = new Date();
    const pubTime = $("div.article-info > p > span:nth-child(2)").first().attr("data-article-publish-time");
    if (pubTime) {
      pubDate = new Date(parseInt(pubTime) * 1000);
    } else {
      const dateStr = $(".date").first().text().substring(0, 16);
      if (dateStr) {
        pubDate = new Date(dateStr);
      }
    }

    return {
      title: $("h1").first().text(),
      author: uniq(
        $(".article-info .author a")
          .map((_, v) => $(v).text())
          .get()
      ).join(", "),
      pubDate,
      description: $(".article-main").first().html(),
    };
  },
});
