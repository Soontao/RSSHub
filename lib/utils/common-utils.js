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
 *
 * @param {cheerio.Root} $
 * @param {Array<string>} texts
 */
function removeTexts($, texts) {
  texts.forEach((text) => $(`p:contains("${text}")`).remove());
  return $;
}

/**
 * create a generic RSSHub endpoint
 *
 * @param {{
 *  endpointPath: string,
 *  entryUrl:string|()=>string,
 *  feedTitle?:string,
 *  concurrency?:number,
 *  linkExtractor?:(page: cheerio.Root) => Array<string>,
 *  linkAndContentContentExtractor?:(page: cheerio.Root)=>Promise<Array<Partial<RSSHubArticle>>>,
 *  contentExtractor?:(page: cheerio.Root)=>Partial<RSSHubArticle>,
 *  jsonExtractor?:(json: any)=>Partial<RSSHubArticle>,
 *  maxItemsInList?:number,
 *  removeTexts?:Array<string>,
 * }} options
 * @returns
 */
function createGenericEndpoint(options) {
  options = Object.assign({}, createGenericEndpoint.default_options, options);
  const { Semaphore, uniq } = require("@newdash/newdash");
  const { fetchText } = require("./http");
  const md5 = require("./md5");
  const sem = new Semaphore(options.concurrency);

  const handler = async (ctx) => {
    const cheerio = require("cheerio");
    const entryUrlValue = typeof options.entryUrl === "function" ? options.entryUrl() : options.entryUrl;
    const $ = cheerio.load(await fetchText(entryUrlValue, options.encoding));

    const title = options?.feedTitle ?? $("title").text();

    ctx.state.data = {
      title,
      link: entryUrlValue,
      item: [],
    };

    if (options.linkExtractor && (options.contentExtractor || options.jsonExtractor)) {
      const links = uniq(options.linkExtractor($).slice(0, options.maxItemsInList));

      if (links.length === 0) {
        logger.warn("no links found", { baseUrl: entryUrlValue });
        return {};
      }

      const items = await Promise.allSettled(
        links.map((link) =>
          sem.use(() =>
            ctx.cache.tryGet(link, () =>
              fetchText(link, options.encoding)
                .then((content) =>
                  options.contentExtractor
                    ? options.contentExtractor(removeTexts(cheerio.load(content), options.removeTexts))
                    : options.jsonExtractor(JSON.parse(content))
                )
                .then((article) => Object.assign({}, article, { link, guid: md5(link) }))
            )
          )
        )
      );

      for (const item of items.filter((item) => item.status === "rejected")) {
        logger.error("fetch error", { error: item.reason?.message, link: item.value });
      }
      ctx.state.data.item = items.filter((item) => item.status === "fulfilled").map((item) => item.value);
    }

    if (options.linkAndContentContentExtractor) {
      ctx.state.data.item = await options.linkAndContentContentExtractor($);
    }
  };
  handler.path = options.endpointPath;
  return handler;
}

createGenericEndpoint.default_options = {
  concurrency: 2,
  maxItemsInList: 15,
  encoding: "utf-8",
  removeTexts: [],
};

/**
 * html text to markdown text
 *
 * @param {string} html
 * @returns
 */
function htmlToMarkdown(html) {
  if (htmlToMarkdown.service === undefined) {
    const TurndownService = require("turndown");
    htmlToMarkdown.service = new TurndownService();
  }
  return htmlToMarkdown.service.turndown(html);
}

function markdownToHtml(markdown) {
  const { marked } = require("marked");
  return marked.parse(markdown);
}

module.exports = {
  toTitleCase,
  createGenericEndpoint,
  htmlToMarkdown,
  markdownToHtml,
  linkExtractors: {
    domAElementLinkExtractor,
  },
};
