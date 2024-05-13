const logger = require("@/utils/logger");
const { load, extract } = require("@node-rs/jieba");
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
        item.category = extract(textWithoutImgsLinks, 5).map((c) => c.keyword);
      }
    } catch (error) {
      logger.error("turn down error", error, "for", ctx.state.data?.link);
    }
  }
};
