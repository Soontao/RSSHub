const { fetchTextWithCrossWallProxy } = require("@/utils/http");
const { createGenericEndpoint, markdownToHtml } = require("@/utils/common-utils");

const endpoint = createGenericEndpoint({
  entryUrl: "https://huggingface.co/papers",
  endpointPath: "/hf-daily-papers",
  feedTitle: "HuggingFace Daily Papers",
  translateTitle: true,
  fetchText: fetchTextWithCrossWallProxy,
  linkExtractor: ($) =>
    $("article .cursor-pointer")
      .get()
      .filter((item) => $(item).attr("href")?.startsWith("/papers"))
      .slice(0, 5)
      .map((item) => "https://huggingface.co" + $(item).attr("href")),
  contentExtractor: async ($) => {
    const data = JSON.parse($("main section div.contents").attr("data-props"));
    const title = data.paper.title.replace(/\n/g, "");
    const summary = data.paper.summary;
    const description = markdownToHtml(`## ${data.paper.title}\n\n${summary}\n\n[Full PDF](https://arxiv.org/pdf/${data.paper.id})`);
    const pubDate = data.publishedOnDailyAt;
    return {
      title,
      pubDate,
      author: data.paper.authors?.map((author) => author.name).join(", "),
      description,
    };
  },
});

module.exports = endpoint;
