const md5 = require('@/utils/md5');
const config = require('@/config').value;
const logger = require('@/utils/logger');
const { Cache } = require('./base');
const { InMemoryCache } = require('./memory');
const { RedisCache } = require('./redis');
const { uniqBy } = require('@newdash/newdash/uniqBy');
const { get } = require('@newdash/newdash/get');


module.exports = function (app, options = {}) {

    const prefix = 'koa-redis-cache-v2:';
    const routeExpire = config.cache.routeExpire;
    const contentExpire = config.cache.contentExpire;
    const ignoreQuery = true;

    let globalCache = new Cache();

    if (config.cache.type === 'redis') {
        globalCache = new RedisCache(config.redis);
    } else {
        globalCache = new InMemoryCache({ options });
    }

    app.context.cache = globalCache;

    function toLongTimeKey(key) {
        return `long-time-cache-v3:${key}`;
    }

    async function loadLongTimeCache(key, partialItems) {
        const allItemsKey = toLongTimeKey(key);
        let allItems = [];
        const allItemsString = await globalCache.get(allItemsKey);
        if (typeof allItemsString === 'string') { allItems = JSON.parse(allItemsString); }
        return uniqBy([...partialItems, ...allItems], 'link') // uniq
            .map((item) => {
                // assign default date
                if (item.pubDate === undefined) { item.pubDate = new Date().toUTCString(); } return item;
            })
            .sort((a, b) => +new Date(b.pubDate || 0) - +new Date(a.pubDate || 0)) // sort by date
            .slice(0, partialItems.length + 100); // pick first 100 records;
    }

    async function saveLongTimeCache(key, mergedItems) {
        const allItemsKey = toLongTimeKey(key);
        if (typeof mergedItems === 'object') {
            mergedItems = JSON.stringify(mergedItems);
        }
        await globalCache.set(allItemsKey, mergedItems, contentExpire);
    }

    async function mergeRouteCache(key, partialItems) {
        const mergedItems = await loadLongTimeCache(key, partialItems);
        return mergedItems;
    }

    async function getRouteCache(ctx, key) {
        const value = await globalCache.get(key, false);
        let ok = false;

        if (value) {
            ctx.response.status = 200;

            if (config.cache.type === 'redis') {
                ctx.response.set({ 'X-Koa-Redis-Cache': 'true' });
            } else {
                ctx.response.set({ 'X-Koa-Memory-Cache': 'true' });
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

    async function saveRouteCache(key, ctx) {
        if (ctx.response.get('Cache-Control') !== 'no-cache' && ctx.state && ctx.state.data) {
            ctx.state.data.lastBuildDate = new Date().toUTCString();
            const body = JSON.stringify(ctx.state.data);
            await globalCache.set(key, body, routeExpire);
        }
    }

    return async function cacheMiddleWare(ctx, next) {
        const { url, path } = ctx.request;
        const resolvedPrefix = typeof prefix === 'function' ? prefix.call(ctx, ctx) : prefix;
        const key = resolvedPrefix + md5(ignoreQuery ? path : url);

        // await cache ready
        await globalCache.syncReady();

        try {
            if (await getRouteCache(ctx, key)) {
                logger.debug(`cache hit: ${key} with ${ctx.url}`);
                return; // cache ready, ctx updated, just return
            }
        } catch (e) {
            logger.error(e);
        }

        await next();

        const item = get(ctx, 'state.data.item');

        if (item !== null && item !== undefined && typeof item === 'object' && item.length > 0) {
            ctx.state.data.item = await mergeRouteCache(url, ctx.state.data.item);
            await saveLongTimeCache(url, ctx.state.data.item);
            await saveRouteCache(key, ctx);
        }


    };
};