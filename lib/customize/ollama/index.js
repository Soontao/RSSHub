const moment = require("moment");
const { createGenericEndpoint, linkExtractors, markdownToHtml } = require("@/utils/common-utils");
const translate = require("@/utils/translate");
const { fetchTextWithCrossWallProxy } = require("@/utils/http");

const endpoint = createGenericEndpoint({
  endpointPath: "/ollama",
  entryUrl: "https://ollama.com/blog",
  fetchText: fetchTextWithCrossWallProxy,
  linkExtractor: linkExtractors.domAElementLinkExtractor("a.group", "https://ollama.com"),
  contentExtractor: async ($) => {
    const title = await translate($("h1").text());
    const rawContent = $("section").html();
    const description = [markdownToHtml([await translate($("section").text().slice(0, 250)), "原文:"].join("\n\n")), rawContent].join("\n");
    const pubDate = moment($("h2.text-neutral-500").text(), "MMMM D, YYYY").toISOString();
    const author = "Ollama Blog";
    return { title, pubDate, author, description };
  },
  maxItemsInList: 5,
});

module.exports = endpoint;
