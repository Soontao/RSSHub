const config = require("rss-libs/config");
const logger = require("./logger");
const translate = require("./translate");

// convert a string into title case
const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");

function domAElementLinkExtractor(selector = "a", prefix = "") {
  return ($) =>
    $(selector)
      .get()
      .map((listItem) => prefix + $(listItem).attr("href"));
}

function fuzzyALinkSelector(matchReg, prefix = "") {
  return ($) =>
    $("a")
      .get()
      .map((listItem) => $(listItem).attr("href"))
      .filter((href) => {
        const match = href.match(matchReg);
        logger.debug(`fuzzyALinkSelector: ${href} ${match}`);
        return match;
      })
      .map((href) => prefix + href);
}

function feedXmlLinkExtractor() {
  // $ is a valid rss feed content
  return ($) =>
    $("item link")
      .get()
      .map((link) => link?.next?.data?.trim());
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

  const parsedPublishedAt = moment(extractedData.published?.toUpperCase());

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
 *  language?: 'en'|'zh-cn', // https://www.rssboard.org/rss-language-codes
 * }} options
 * @returns
 */
function createGenericEndpoint(options) {
  options = Object.assign({}, createGenericEndpoint.default_options, options);
  const { Semaphore, uniq } = require("@newdash/newdash");
  const moment = require("moment");
  const md5 = require("./md5");
  const sem = new Semaphore(options.concurrency);

  /**
   *
   * @param {RSSHubKoaContext} ctx
   * @returns
   */
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
      allowEmpty: true,
      language: options.language,
    };

    ctx.state.skip_pure = options.skipPure;

    if (options.linkExtractor && (options.contentExtractor || options.jsonExtractor)) {
      const links = uniq(options.linkExtractor($)).slice(0, Math.min(options.maxItemsInList, 100));

      if (links.length === 0) {
        logger.warn("no links found", { baseUrl: entryUrlValue });
        return {};
      }

      logger.debug("links", links);

      const items = await Promise.allSettled(links.map((link) => sem.use(() =>
        ctx.cache.tryGet(link, async function retrieveArticle() {
          try {
            const content = await options.fetchText(link, options.encoding);

            const article = options.contentExtractor
              ? await options.contentExtractor(removeTexts(cheerio.load(content), options.removeTexts))
              : await options.jsonExtractor(JSON.parse(content));

            if (article === undefined) {
              logger.warn("no content for link", link, "extractor", options.contentExtractor?.name);
              logger.debug("content is", content);
              return undefined;
            }

            if (article.pubDate === undefined || article.pubDate === null) {
              logger.warn("no pubDate for link", link);
              return undefined;
            }

            if (moment(article.pubDate).isBefore(moment().subtract(config.value.maxOldItemPubDateInDays, "day"))) {
              logger.debug("article is too old", link, "option maxOldItemPubDateInDays is", config.value.maxOldItemPubDateInDays);
              return undefined;
            }

            if (options.translateTitle) {
              article.title = await translate(article.title);
            }

            const guid = md5(
              [title, moment(new Date()).format("yyyy-MM"), article?.title?.trim()?.replace(/[^\w^\s^\u4e00-\u9fa5]/gi, "") ?? link].join("|")
            );

            return Object.assign({}, article, { link, guid });
          } catch (error) {
            logger.error("fetch error", { error: error.message, cause: error.cause, link });
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
  concurrency: 4,
  maxItemsInList: 15,
  encoding: "utf-8",
  fetchText: require("./http").fetchText,
  removeTexts: [],
  language: "zh-cn",
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
    fuzzyALinkSelector,
    feedXmlLinkExtractor,
  },
  contentExtractors: {
    jsContentExtractor,
    js: jsContentExtractor,
  },
};
