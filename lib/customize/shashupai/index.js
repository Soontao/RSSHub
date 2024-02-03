const got = require("got");
const cheerio = require("cheerio");
const { get } = require("@newdash/newdash/get");

/**
 * @param {import("koa").Context} ctx
 */
const endpoint = async (ctx) => {
  const url = "https://sspai.com";

  const listResponse = await got(url);
  const $ = cheerio.load(listResponse.body);
  const listItems = $(".articleCard").get();
  const title = $("title").text().trim();

  const postIds = listItems
    .map((item) => {
      const href = $(item).find(".img_box a").attr("href");
      if (href === undefined) {
        return undefined;
      }

      const postId = /^\/post\/([0-9]+)$/.exec(href)[1];
      return postId;
    })
    .filter(Boolean);

  const items = await Promise.all(
    postIds.map((postId) => {
      const apiLink = `${url}/api/v1/article/info/get?id=${postId}&view=second`;
      const pageLink = `${url}/post/${postId}`;

      return ctx.cache.tryGet(apiLink, async () => {
        const { body } = await got(apiLink, { responseType: "json" });

        return {
          title: get(body, "data.title"),
          link: pageLink,
          guid: pageLink,
          author: get(body, "data.author.nickname"),
          description: get(body, "data.body"),
          pubDate: new Date(get(body, "data.released_time") * 1000),
        };
      });
    }),
  );

  ctx.state.data = {
    title,
    link: url,
    item: items,
  };
};

/**
 * endpoint path
 */
endpoint.path = "/shaoshupai";

endpoint.name = "少数派";

endpoint.examples = ["/shaoshupai"];

module.exports = endpoint;
