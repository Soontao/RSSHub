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

/**
 * Extract links from a cheerio object
 *
 * @param {*} selector
 * @param {*} prefix
 * @returns
 */
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
function removeTexts($, texts = []) {
  texts.forEach((text) => $(`p:contains("${text}")`).remove());
  return $;
}

function removeSelectors($, selectors = []) {
  selectors.forEach((selector) => $(selector).remove());
  return $;
}

/**
 * @typedef TextRetriever
 * @type {(url:string, encoding:string)=>Promise<string>}
 */

/**
 * @typedef LinkExtractor
 * @type {(page: cheerio.Root) => Array<string>}
 */

/**
 * @typedef LinkAndContentExtractor
 * @type {(page: cheerio.Root) => Promise<Array<Partial<RSSHubArticle>>>}
 */

/**
 * @typedef ContentExtractor
 * @type {(page: cheerio.Root) => Promise<Partial<RSSHubArticle>>}
 */

/**
 * @typedef JSONExtractor
 * @type {(json: any)=>Promise<Partial<RSSHubArticle>>}
 */

/**
 * @typedef GenericHandlerParams
 * @property {string} endpointPath
 * @property {string|()=>string} entryUrl
 * @property {string} [feedTitle]
 * @property {number} [concurrency] concurrency
 * @property {LinkExtractor} [linkExtractor]
 * @property {LinkAndContentExtractor} [linkAndContentContentExtractor]
 * @property {ContentExtractor} [contentExtractor]
 * @property {JSONExtractor} [jsonExtractor]
 * @property {number} [maxItemsInList=15]
 * @property {Array<string>} [removeTexts]
 * @property {Array<string>} [removeSelectors]
 * @property {TextRetriever} [fetchText]
 * @property {boolean} [skipPure] skip pure/clean up text
 * @property {boolean} [translateTitle]
 * @property {'en'|'zh-cn'} [language]
 * @property {number} [atLeastPublishedInMinutes] bring feed entry to list when its at least published after minutes
 */

/**
 * create a generic RSSHub endpoint
 *
 * @param {GenericHandlerParams} options
 * @returns
 */
function createGenericEndpoint(options) {
  options = Object.assign({}, GENERIC_ENDPOINT_DEFAULT_OPTIONS, options);
  const { Semaphore, uniq, uniqBy } = require("@newdash/newdash");
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
      title, link: entryUrlValue, item: [], allowEmpty: true, language: options.language,
    };

    ctx.state.skip_pure = options.skipPure;

    if (options.linkExtractor && (options.contentExtractor || options.jsonExtractor)) {
      const links = uniq(options.linkExtractor($)).slice(0, Math.min(options.maxItemsInList, 100));

      if (links.length === 0) {
        logger.warn("no links found", { baseUrl: entryUrlValue });
        return {};
      }

      logger.debug("links", links);

      const items = await Promise.allSettled(
        links.map((link) =>
          sem.use(() =>
            ctx.cache.tryGet(link, async function retrieveArticle() {
              try {
                const content = await options.fetchText(link, options.encoding);
                const article = options.contentExtractor
                  ? await options.contentExtractor(removeSelectors(removeTexts(cheerio.load(content), options.removeTexts), options.removeSelectors))
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

                if (article.title == undefined || article.description == undefined) {
                  logger.warn("no title or description for link", link);
                  return undefined;
                }

                if (moment(article.pubDate).isBefore(moment().subtract(config.value.maxOldItemPubDateInDays, "day"))) {
                  logger.debug("article is too old", link, "option maxOldItemPubDateInDays is", config.value.maxOldItemPubDateInDays);
                  return undefined;
                }

                if (options.atLeastPublishedInMinutes && moment(article.pubDate).isAfter(moment().subtract(options.atLeastPublishedInMinutes, 'minutes'))) {
                  logger.debug("article is too new", link, "option atLeastPublishedInMinutes is", options.atLeastPublishedInMinutes);
                  return undefined;
                }

                if (options.translateTitle) {
                  article.title = await translate(article.title);
                }

                const normalizedTitle = article?.title?.trim()?.replace(/[^\w^\s^\u4e00-\u9fa5]/gi, "")

                const guid = md5(
                  [title, moment().format("yyyy-MM-dd"), normalizedTitle ?? link].join("|")
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
      ctx.state.data.item = uniqBy(items.filter((item) => item.value !== undefined).map((item) => item.value), item => item.title?.replace(/[^\w\u4e00-\u9fa5]/g, ''));
    }

    if (options.linkAndContentContentExtractor) {
      ctx.state.data.item = await options.linkAndContentContentExtractor($);
    }
  };
  handler.path = options.endpointPath;
  return handler;
}

const GENERIC_ENDPOINT_DEFAULT_OPTIONS = {
  concurrency: config.value.defaultConcurrency,
  maxItemsInList: 15,
  encoding: "utf-8",
  fetchText: require("./http").fetchText,
  removeTexts: [],
  language: "zh-cn",
  atLeastPublishedInMinutes: 0.5,
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

/**
 * Build generic endpoint handler
 */
class GenericEndpointBuilder {
  constructor() {
    this.options = Object.assign({}, GENERIC_ENDPOINT_DEFAULT_OPTIONS);
  }

  /**
   * 设置端点路径。
   * @param {string} path - 端点路径。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withEndpointPath(path) {
    this.options.endpointPath = path;
    return this;
  }

  /**
   * 设置入口URL。
   * @param {string} url - 入口URL。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withEntryUrl(url) {
    this.options.entryUrl = url;
    return this;
  }

  /**
   * 设置Feed标题
   *
   * @param {string} title - Feed标题。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withFeedTitle(title) {
    this.options.feedTitle = title;
    return this;
  }

  /**
   * 设置并发数
   *
   * @param {number} concurrency - 并发数。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withConcurrency(concurrency) {
    this.options.concurrency = concurrency;
    return this;
  }

  /**
   * 设置链接提取器。
   * @param {Function} extractor - 链接提取器函数。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withLinkExtractor(extractor) {
    this.options.linkExtractor = extractor;
    return this;
  }

  /**
   *
   * @param {string} selector
   * @param {string?} prefix
   * @returns
   */
  withDomAEleLinkExtractor(selector, prefix) {
    return this.withLinkExtractor(domAElementLinkExtractor(selector, prefix));
  }

  /**
   * 设置链接和内容提取器。
   * @param {LinkAndContentExtractor} extractor - 链接和内容提取器函数。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withLinkAndContentContentExtractor(extractor) {
    this.options.linkAndContentContentExtractor = extractor;
    return this;
  }

  /**
   * 设置内容提取器。
   * @param {ContentExtractor} extractor - 内容提取器函数。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withContentExtractor(extractor) {
    if (!this.options.contentExtractor) {
      this.options.contentExtractor = extractor;
    } else {
      const e0 = this.options.contentExtractor;
      this.options.contentExtractor = async (...args) => {
        return Object.assign({}, await e0(...args), await extractor(...args))
      }
    }

    return this;
  }

  withAutoContentExtractor() {
    return this.withContentExtractor(jsContentExtractor)
  }

  /**
   * 设置JSON提取器。
   *
   * @param {JSONExtractor} extractor - JSON提取器函数。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withJsonExtractor(extractor) {
    this.options.jsonExtractor = extractor;
    return this;
  }

  /**
   * 设置列表中最大条目数。
   *
   * @param {number} maxItems - 最大条目数。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withMaxItemsInList(maxItems) {
    this.options.maxItemsInList = maxItems;
    return this;
  }

  /**
   * 设置要移除的文本。
   *
   * @param {string[]} texts - 要移除的文本数组。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withRemoveTexts(texts) {
    this.options.removeTexts = texts;
    return this;
  }

  withRemoveSelectors(selectors) {
    this.options.removeSelectors = selectors;
    return this;
  }


  /**
   * method to fetch text
   *
   * @param {any} fetchFunction - 获取文本的函数。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withFetchText(fetchFunction) {
    this.options.fetchText = fetchFunction;
    return this;
  }

  /**
   * use `pure` approach to clear text
   *
   * @param {boolean} skip
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withSkipPure(skip) {
    this.options.skipPure = skip;
    return this;
  }

  /**
   * 设置是否翻译标题
   *
   * @param {boolean} translate - 是否翻译标题。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withTranslateTitle(translate) {
    this.options.translateTitle = translate;
    return this;
  }

  /**
   * 设置语言。
   * @param {'en'|'zh-cn'} language - 语言代码。
   * @returns {GenericEndpointBuilder} - 当前构建器实例，以便链式调用。
   */
  withLanguage(language) {
    this.options.language = language;
    return this;
  }

  /**
   * 构建并返回 `createGenericEndpoint` 的参数对象。
   */
  build() {
    return createGenericEndpoint(this.options);
  }

  static new() {
    return new GenericEndpointBuilder();
  }
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
  GenericEndpointBuilder,
};
