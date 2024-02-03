const got = require("got");
const cheerio = require("cheerio");
const { Semaphore } = require("@newdash/newdash/functional/Semaphore");

const sem = new Semaphore(3);

/**
 * @param {import("koa").Context} ctx
 */
const endpoint = async (ctx) => {
  const url = "https://nodejs.org/en/blog/";

  const listResponse = await got(url);
  const $ = cheerio.load(listResponse.body);
  const title = $("title").text().trim();
  const listItems = $("#main > div > ul > li").get().slice(0, 10);
  const items = await Promise.all(
    listItems.map((listItem) => {
      const link = "https://nodejs.org" + $(listItem).find("a").attr("href");

      return ctx.cache.tryGet(link, async () =>
        sem.use(async () => {
          const itemResponse = await got(link);
          const $item = cheerio.load(itemResponse.body);
          return {
            title: $item("#main > div > article > div > h1").text(),
            pubDate: $item("#main > div > article > div > span > time").attr(
              "datetime",
            ),
            link,
            guid: link,
            description: $item("#main > div > article").html(),
          };
        }),
      );
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
endpoint.path = "/nodejs/blogs";

endpoint.name = "NodeJS Blogs";

endpoint.examples = ["/nodejs/blogs"];

module.exports = endpoint;
