const { createGenericEndpoint, linkExtractors } = require("rss-libs/utils/common-utils");

const endpoint = createGenericEndpoint({
  endpointPath: "/gouhuo",
  feedTitle: "篝火营地",
  entryUrl: "https://gouhuo.qq.com/content/tablist/1_109",
  linkExtractor: linkExtractors.aLinkExtractor(".we-list .we-list-item .we-figure-info a"),
  contentExtractor: ($) => ({
    title: $("h1").text(),
    author: $(".widget-article-hd .widget-article-info-text").text(),
    description: $(".widget-article-bd").html(),
    pubDate: new Date(
      parseInt(
        $("body > script:nth-child(2)")
          .text()
          .match(/publish_ts:(\d+)/)?.[1]
      ) * 1000
    ).toISOString(),
  }),
});

module.exports = endpoint;
