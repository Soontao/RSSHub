const moment = require("moment");
const { createGenericEndpoint, linkExtractors, markdownToHtml } = require("rss-libs/utils/common-utils");
const translate = require("rss-libs/utils/translate");
const { fetchTextWithCrossWallProxy } = require("rss-libs/utils/http");

const endpoint = createGenericEndpoint({
  endpointPath: "/ollama",
  entryUrl: "https://ollama.com/blog",
  fetchText: fetchTextWithCrossWallProxy,
  linkExtractor: linkExtractors.domAElementLinkExtractor("a.group", "https://ollama.com"),
  translateTitle: true,
  language: "en",
  contentExtractor: async ($) => {
    const title = $("h1").text();
    const rawContent = $("section").html();
    const description = [markdownToHtml([await translate($("section").text().slice(0, 250)), "原文:"].join("\n\n")), rawContent].join("\n");
    const pubDate = moment($("h2.text-neutral-500").text(), "MMMM D, YYYY").toISOString();
    const author = "Ollama Blog";
    return { title, pubDate, author, description };
  },
  maxItemsInList: 5,
});

module.exports = endpoint;
