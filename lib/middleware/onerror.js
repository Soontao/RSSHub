const logger = require("@/utils/logger");

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(
      `Error in ${ctx.request.path}: [${err.constructor.name}] ${err.message}`,
    );
    logger.error(err.stack);

    const status = err.status || 500;

    ctx.body = {
      error: {
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
        status,
      },
    };

    ctx.status = status;

    if (!ctx.debug.errorPaths[ctx.request.path]) {
      ctx.debug.errorPaths[ctx.request.path] = 0;
    }
    ctx.debug.errorPaths[ctx.request.path]++;

    if (!ctx.debug.errorRoutes[ctx._matchedRoute]) {
      ctx._matchedRoute && (ctx.debug.errorRoutes[ctx._matchedRoute] = 0);
    }
    ctx._matchedRoute && ctx.debug.errorRoutes[ctx._matchedRoute]++;

    if (!ctx.state.debuged) {
      if (!ctx.debug.routes[ctx._matchedRoute]) {
        ctx._matchedRoute && (ctx.debug.routes[ctx._matchedRoute] = 0);
      }
      ctx._matchedRoute && ctx.debug.routes[ctx._matchedRoute]++;

      if (
        ctx.response.get("X-Koa-Redis-Cache") ||
        ctx.response.get("X-Koa-Memory-Cache")
      ) {
        ctx.debug.hitCache++;
      }
    }
  }
};
