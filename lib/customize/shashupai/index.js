const { createGenericEndpoint } = require("@/utils/common-utils");

module.exports = createGenericEndpoint({
  feedTitle: "少数派",
  entryUrl: "https://sspai.com",
  endpointPath: "/shaoshupai",
  linkExtractor: ($) =>
    $(".articleCard")
      .get()
      .map((item) => {
        const href = $(item).find(".img_box a").attr("href");
        if (href === undefined) {
          return undefined;
        }
        return /^\/post\/([0-9]+)$/.exec(href)?.[1];
      })
      .filter(Boolean)
      .map((postId) => `https://sspai.com/api/v1/article/info/get?id=${postId}&view=second`),
  jsonExtractor: (body) => ({
    title: body?.data?.title,
    description: body?.data?.body,
    author: body?.data?.author?.nickname,
    pubDate: new Date(body?.data?.released_time * 1000).toISOString(),
  }),
});
