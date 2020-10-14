const { trimPrefix } = require('@newdash/newdash/trimPrefix');

const EMPTY_MASK = '::ffff:';

module.exports = async (ctx, next) => {

    if (!ctx.debug.paths[ctx.request.path]) {
        ctx.debug.paths[ctx.request.path] = 0;
    }

    ctx.debug.paths[ctx.request.path]++;

    const ip = trimPrefix(ctx.ips[0] || ctx.ip, EMPTY_MASK);

    if (!ctx.debug.ips[ip]) {
        ctx.debug.ips[ip] = 0;
    }
    ctx.debug.ips[ip]++;
    ctx.debug.request++;

    await next();

    if (!ctx.debug.routes[ctx._matchedRoute]) {
        ctx._matchedRoute && (ctx.debug.routes[ctx._matchedRoute] = 0);
    }
    ctx._matchedRoute && ctx.debug.routes[ctx._matchedRoute]++;

    if (ctx.response.get('X-Koa-Redis-Cache') || ctx.response.get('X-Koa-Memory-Cache')) {
        ctx.debug.hitCache++;
    }

    ctx.state.debuged = true;

    if (ctx.status === 304) {
        ctx.debug.etag++;
    }
};
