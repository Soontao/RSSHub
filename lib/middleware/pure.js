/* eslint-disable no-useless-escape */
const logger = require("@/utils/logger");
const { extract } = require("@node-rs/jieba");
const TurndownService = require("turndown");
const turndownService = new TurndownService();
const { marked } = require("marked");
const cheerio = require("cheerio");

/**
 *
 * @param {RSSHubKoaContext} ctx
 * @param {*} next
 */
module.exports = async (ctx, next) => {
  await next();

  for (const item of ctx.state?.data?.item ?? []) {
    try {
      if (item.description) {
        const mdContext = turndownService.turndown(cheerio.load(item.description)("script").remove().html());
        item.description = marked.parse(mdContext);
        if (item.category === undefined) {
          const textWithoutImgsLinks = mdContext.replace(/!\[.*?\]\(.*?\)/g, "");
          item.category = extract(textWithoutImgsLinks, 6)
            .map((c) => c.keyword)
            // is not a text contains number only
            .filter((c) => !/^[\d\.]+$/.test(c));
        }
      }
    } catch (error) {
      logger.error("turn down error", { error, link: ctx.stale.data?.link });
    }
  }
};
