const { createGenericEndpoint } = require("@/utils/common-utils");
const translate = require("@/utils/translate");

const endpoint = createGenericEndpoint({
  endpointPath: "/hacker-news",
  entryUrl: "https://hackernews.betacat.io/zh.html",
  linkAndContentContentExtractor: async ($) => {
    const moment = require("moment");
    const md5 = require("@/utils/md5");
    const posts = $(".post-item");
    return Promise.all(
      posts
        .filter((_, post) => $(post).find(".post-title").length > 0)
        .slice(0, 15)
        .map(async (_, post) => {
          const title = await translate($(post).find(".post-title").text().trim());
          const description = await translate($(post).find(".post-summary .summary-text").text().trim());
          const author = $(post).find(".post-meta .author-link span").text();
          const pubDate = moment($(post).find(".last-updated").attr("data-submitted"));
          const link = $(post).find(".post-url").attr("href");
          const guid = md5(title);
          return {
            title,
            description: `<p>${description}</p><br><a href="${link}">Reference Link</a>`,
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
