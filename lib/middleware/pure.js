const logger = require("@/utils/logger");
const { load, extract } = require("@node-rs/jieba");
const TurndownService = require("turndown");
const turndownService = new TurndownService();
const { marked } = require("marked");

load();

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
        item.category = extract(mdContext, 2).map((c) => c.keyword);
      }
    } catch (error) {
      logger.error("turn down error", error, "for", ctx.state.data?.link);
    }
  }
};
