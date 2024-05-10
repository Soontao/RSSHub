require("@/customize/type");

const metadata = {
  /**
   * service/website name
   */
  rss_name: "HuggingFace Daily Papers",

  /**
   * path of rsshub
   */
  path: "/hf-daily-papers",

  /**
   * example path if with parameter
   */
  examples: ["/hf-daily-papers"],
};

const got = require("got");
const cheerio = require("cheerio");
const { Semaphore } = require("@newdash/newdash/functional/Semaphore");

const sem = new Semaphore(3);

/**
 * @param {RSSHubKoaContext} ctx
 */
const endpoint = async (ctx) => {
  const url = "https://huggingface.co/papers";

  const listResponse = await got(url);
  const $ = cheerio.load(listResponse.body);
  const title = $("title").text().trim();
  const listItems = $(".cursor-pointer").get();

  const items = await Promise.allSettled(
    listItems.map((listItem) => {
      const link = url + $(listItem).find("a").attr("href");

      return ctx.cache.tryGet(link, async () =>
        sem.use(async () => {
          const itemResponse = await got(link);
          const $item = cheerio.load(itemResponse.body);
          const arXivLink = $item(
            "body > div > main > div > section > div > div > a:nth-child(1)",
          ).attr("href");
          const arXivContent = await got(arXivLink);
          const $arXivContent = cheerio.load(arXivContent.body);
          return {
            title: $item("h1").text(),
            pubDate: $arXivContent,
            author: $arXivContent(".authors a")
              .map((a) => a.text())
              .get()
              .join(", "),
            link: arXivLink,
            guid: arXivLink,
            description: $arXivContent("#abs > blockquote").html(),
          };
        }),
      );
    }),
  );

  ctx.state.data = {
    title,
    link: url,
    item: items
      .filter((item) => item.status === "fulfilled")
      .map((item) => item.value),
  };
};

module.exports = Object.assign(endpoint, metadata);
