const logger = require("./logger");
const translate = require("./translate");

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
 * @param {cheerio.Root} page
 * @returns {Partial<RSSHubArticle>}
 */
async function jsContentExtractor(page) {
  const moment = require("moment");
  const { extractFromHtml } = await import("@extractus/article-extractor");
  const extractedData = await extractFromHtml(page.html().trim());

  if (extractedData === null) {
    return;
  }

  const parsedPublishedAt = moment(extractedData.published);

  return {
    title: extractedData.title,
    author: extractedData.author,
    link: extractedData.url,
    description: extractedData.content,
    pubDate: parsedPublishedAt.isValid() ? parsedPublishedAt.toDate() : new Date(),
  };
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
 *  contentExtractor?:(page: cheerio.Root)=>Promise<Partial<RSSHubArticle>>,
 *  jsonExtractor?:(json: any)=>Promise<Partial<RSSHubArticle>>,
 *  maxItemsInList?:number,
 *  removeTexts?:Array<string>,
 *  fetchText?:(url:string, encoding:string)=>Promise<string>,
 *  skipPure?:boolean,
 *  translateTitle?:boolean,
 * }} options
 * @returns
 */
function createGenericEndpoint(options) {
  options = Object.assign({}, createGenericEndpoint.default_options, options);
  const { Semaphore, uniq } = require("@newdash/newdash");
  const md5 = require("./md5");
  const sem = new Semaphore(options.concurrency);

  const handler = async (ctx) => {
    const cheerio = require("cheerio");
    const entryUrlValue = typeof options.entryUrl === "function" ? options.entryUrl() : options.entryUrl;
    const htmlText = await options.fetchText(entryUrlValue, options.encoding);
    const $ = cheerio.load(htmlText);

    const title = options?.feedTitle ?? $("title").text();

    ctx.state.data = {
      title,
      link: entryUrlValue,
      item: [],
    };

    ctx.state.skip_pure = options.skipPure;

    if (options.linkExtractor && (options.contentExtractor || options.jsonExtractor)) {
      const links = uniq(options.linkExtractor($).slice(0, options.maxItemsInList));

      if (links.length === 0) {
        logger.warn("no links found", { baseUrl: entryUrlValue });
        return {};
      }

      logger.debug("links", links);

      const items = await Promise.allSettled(
        links.map((link) =>
          sem.use(() =>
            ctx.cache.tryGet(link, async () => {
              try {
                const content = await options.fetchText(link, options.encoding);

                const article = options.contentExtractor
                  ? await options.contentExtractor(removeTexts(cheerio.load(content), options.removeTexts))
                  : await options.jsonExtractor(JSON.parse(content));

                if (article === undefined) {
                  logger.warn("no content for link", link);
                  return undefined;
                }

                if (options.translateTitle) {
                  article.title = await translate(article.title);
                }

                return Object.assign({}, article, { link, guid: md5(link) });
              } catch (error) {
                logger.error("fetch error", { error: error.message, link });
                return undefined;
              }
            })
          )
        )
      );
      ctx.state.data.item = items.filter((item) => item.value !== undefined).map((item) => item.value);
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
  fetchText: require("./http").fetchText,
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
    aLinkExtractor: domAElementLinkExtractor,
  },
  contentExtractors: {
    jsContentExtractor,
    js: jsContentExtractor,
  },
};
