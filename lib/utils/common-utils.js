const logger = require("./logger");

// convert a string into title case
const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");

function domAElementLinkExtractor(selector, prefix = "") {
  return ($) =>
    $(selector)
      .get()
      .map((listItem) => prefix + $(listItem).attr("href"));
}

/**
 * create a generic RSSHub endpoint
 *
 * @param {{
 *  endpointPath: string,
 *  entryUrl:string,
 *  feedTitle?:string,
 *  concurrency?:number,
 *  linkExtractor:(page: cheerio.Root) => Array<string>,
 *  contentExtractor:(page: cheerio.Root)=>Partial<RSSHubArticle>,
 *  maxItemsInList?:number,
 * }} options
 * @returns
 */
function createGenericEndpoint(options) {
  options = Object.assign({}, createGenericEndpoint.default_options, options);
  const { Semaphore } = require("@newdash/newdash");
  const { fetchText } = require("./http");
  const md5 = require("./md5");
  const sem = new Semaphore(options.concurrency);

  const handler = async (ctx) => {
    const cheerio = require("cheerio");
    const $ = cheerio.load(await fetchText(options.entryUrl, options.encoding));
    const title = options?.feedTitle ?? $("title").text();
    const links = options.linkExtractor($).slice(0, options.maxItemsInList);

    if (links.length === 0) {
      logger.warn("no links found", { baseUrl: options.entryUrl });
      return {};
    }

    const items = await Promise.allSettled(
      links.map((link) =>
        sem.use(() =>
          ctx.cache.tryGet(link, () =>
            fetchText(link, options.encoding).then((content) => ({
              link,
              guid: md5(link),
              ...options.contentExtractor(cheerio.load(content)),
            }))
          )
        )
      )
    );

    for (const item of items.filter((item) => item.status === "rejected")) {
      logger.error("fetch error", { error: item.reason?.message, link: item.value });
    }

    ctx.state.data = {
      title,
      link: options.entryUrl,
      item: items.filter((item) => item.status === "fulfilled").map((item) => item.value),
    };
  };
  handler.path = options.endpointPath;
  return handler;
}

createGenericEndpoint.default_options = {
  concurrency: 2,
  maxItemsInList: 15,
  encoding: "utf-8",
};

module.exports = {
  toTitleCase,
  createGenericEndpoint,
  linkExtractors: {
    domAElementLinkExtractor,
  },
};
