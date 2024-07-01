const { createGenericEndpoint, markdownToHtml } = require("@/utils/common-utils");
const { fetchByJina } = require("@/utils/http");
const logger = require("@/utils/logger");
const translate = require("@/utils/translate");

const endpoint = createGenericEndpoint({
  endpointPath: "/hacker-news",
  entryUrl: "https://hackernews.betacat.io/",
  linkAndContentContentExtractor: async ($) => {
    const moment = require("moment");
    const md5 = require("@/utils/md5");
    const posts = $(".post-item");
    return Promise.all(
      posts
        .filter((_, post) => $(post).find(".post-title").length > 0)
        .slice(0, 5)
        .map(async (_, post) => {
          const title = await translate($(post).find(".post-title").text().trim());
          const description = await translate($(post).find(".post-summary .summary-text").text().trim());
          const author = $(post).find(".post-meta .author-link span").text();
          const pubDate = moment($(post).find(".last-updated").attr("data-submitted"));
          const link = $(post).find(".post-url").attr("href");
          const linkContent = await fetchByJina(link).catch((error) => {
            logger.error("fetchByJina error", { error: error.message, link });
            return `> fetch error for ${link}: ${error.message}`;
          });
          const guid = md5(link);
          return {
            title,
            description: `<p>${description}</p><p>----Content----</p>${markdownToHtml(linkContent)}`,
            author,
            pubDate,
            link,
            guid,
          };
        })
        .get()
    );
  },
});

module.exports = endpoint;
