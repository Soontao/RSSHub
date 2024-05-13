const logger = require("@/utils/logger");
const { extract } = require("@node-rs/jieba");
const TurndownService = require("turndown");
const turndownService = new TurndownService();
const { marked } = require("marked");

/**
 *
 * @param {RSSHubKoaContext} ctx
 * @param {*} next
 */
module.exports = async (ctx, next) => {
  await next();

  for (const item of ctx.state?.data?.item ?? []) {
    try {
      const mdContext = turndownService.turndown(item.description);
      item.description = marked.parse(mdContext);
      if (item.category == undefined) {
        const textWithoutImgsLinks = mdContext.replace(/!\[.*?\]\(.*?\)/g, "");
        item.category = extract(textWithoutImgsLinks, 6)
          .map((c) => c.keyword)
          // is not a text contains number only
          .filter((c) => !/^[\d\.]+$/.test(c));
      }
    } catch (error) {
      logger.error("turn down error", error, "for", ctx.state.data?.link);
    }
  }
};
