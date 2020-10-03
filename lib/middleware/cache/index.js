const md5 = require('@/utils/md5');
const config = require('@/config').value;
const logger = require('@/utils/logger');
const { Cache } = require('./base');
const { InMemoryCache } = require('./memory');
const { RedisCache } = require('./redis');

module.exports = function (app, options = {}) {

    const {
        prefix = 'koa-redis-cache-v2:',
        expire = config.cache.routeExpire,
        passParam = '',
        ignoreQuery = true
    } = options;

    let globalCache = new Cache();

    if (config.cache.type === 'redis') {
        globalCache = new RedisCache(config.redis);
    } else {
        globalCache = new InMemoryCache({ options });
    }

    app.context.cache = globalCache;

    async function getCache(ctx, key) {
        const value = await globalCache.get(key);
        let ok = false;

        if (value) {
            ctx.response.status = 200;

            if (config.cache.type === 'redis') {
                ctx.response.set({ 'X-Koa-Redis-Cache': 'true', });
            } else {
                ctx.response.set({ 'X-Koa-Memory-Cache': 'true', });
            }

            try {
                ctx.state.data = JSON.parse(value);
            } catch (e) {
                ctx.state.data = {};
            }

            ok = true;
        }

        return ok;
    }

    async function setCache(ctx, key, expire) {
        if (ctx.response.get('Cache-Control') !== 'no-cache' && ctx.state && ctx.state.data) {
            ctx.state.data.lastBuildDate = new Date().toUTCString();
            const body = JSON.stringify(ctx.state.data);
            await globalCache.set(key, body, expire);
        }
    }

    return async function cacheMiddleWare(ctx, next) {
        const { url, path } = ctx.request;
        const resolvedPrefix = typeof prefix === 'function' ? prefix.call(ctx, ctx) : prefix;
        const key = resolvedPrefix + md5(ignoreQuery ? path : url);

        if (globalCache.ready() && (passParam && ctx.request.query[passParam])) {
            logger.debug('cache provider is not ready');
            return await next();
        }

        try {
            if (await getCache(ctx, key)) {
                logger.debug(`cache hit: ${key} with ${ctx.url}`);
                return; // cache ready, ctx updated, just return
            }
        } catch (e) {
            logger.error(e);
        }

        await next();

        try {
            setCache(ctx, key, expire);
        } catch (e) {
            logger.error(e);
        }
    };
};
