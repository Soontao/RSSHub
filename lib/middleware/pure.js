const logger = require("@/utils/logger");

/**
 *
 * @param {RSSHubKoaContext} ctx
 * @param {*} next
 */
module.exports = async (ctx, next) => {
  await next();
  const TurndownService = require("turndown");
  const turndownService = new TurndownService();
  const { marked } = require("marked");

  ctx.state?.data?.item?.forEach((item) => {
    try {
      const mdContext = turndownService.turndown(item.description);
      item.description = marked
        .parse(mdContext)
        .replace(/[<p></p>]+/g, "<p></p>");
    } catch (error) {
      logger.error("turn down error", error, "for", ctx.state.data?.link);
    }
  });
};
