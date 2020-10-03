const md5 = require('@/utils/md5');
const config = require('@/config').value;
const logger = require('@/utils/logger');


class Cache {

    async tryGet(key, getValueFunc, maxAge = config.cache.contentExpire) {
        logger.debug(`try get: ${key}`);
        let v = await this.get(key);
        if (!v) {
            v = await getValueFunc();
            this.set(key, v, maxAge);
        } else {
            let parsed;
            try {
                parsed = JSON.parse(v);
            } catch (e) {
                parsed = null;
            }
            if (parsed) {
                v = parsed;
            }
        }

        return v;
    }

    ready() { return true; }
    set() { return null; }
    get() { return null; }
}

class RedisCache extends Cache {

    constructor(redisConfig = {}) {
        super();
        const wrapper = require('co-redis');
        const Redis = require('redis');
        const {
            host: redisHost = 'localhost',
            port: redisPort = 6379,
            url: redisUrl = `redis://${redisHost}:${redisPort}/`,
            options: redisOptions = {}
        } = redisConfig;
        if (!redisOptions.password) { delete redisOptions.password; }
        this.connected = false;
        this.client = wrapper(Redis.createClient(redisUrl, redisOptions));
        this.client.on('error', (error) => {
            logger.error('Redis error: ', error);
        });
        this.client.on('end', () => {
        });
        this.client.on('connect', () => {
            this.connected = true;
            logger.info('Redis connected.');
        });
    }

    async get(key, refresh = true) {
        if (key && this.connected) {
            let value = await this.client.get(key);
            if (value && refresh) {
                this.client.expire(key, config.cache.contentExpire);
                value = value + '';
            }
            return value;
        }
    }

    ready() {
        return this.connected;
    }

    set(key, value, maxAge = config.cache.contentExpire) {
        if (!this.connected) {
            return;
        }
        if (!value || value === 'undefined') {
            value = '';
        }
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        if (key) {
            this.client.setex(key, maxAge, value);
        }
    }

}

class InMemoryCache extends Cache {

    constructor({ expire, maxLength }) {
        super();
        const Lru = require('lru-cache');

        this.pageCache = new Lru({
            maxAge: expire * 1000,
            max: maxLength,
        });

        this.routeCache = new Lru({
            maxAge: expire * 1000,
            max: maxLength,
            updateAgeOnGet: true,
        });
    }

    get(key, refresh = true) {
        if (key) {
            let value = (refresh ? this.routeCache : this.pageCache).get(key);
            if (value) {
                value = value + '';
            }
            return value;
        }
    }

    set(key, value, maxAge = config.cache.contentExpire, refresh = true) {
        if (!value || value === 'undefined') {
            value = '';
        }
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        if (key) {
            return (refresh ? this.routeCache : this.pageCache).set(key, value, maxAge * 1000);
        }
    }

}

module.exports = function (app, options = {}) {

    const {
        prefix = 'koa-redis-cache:',
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
        logger.debug(`get cache: ${key}`);
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
        logger.debug(`set cache: ${key}`);

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
                return; // cache ready, ctx updated, just return
            }
        } catch (e) {
            logger.error(e);
        }

        await next();

        try {
            const trueExpire = expire;
            setCache(ctx, key, trueExpire);
        } catch (e) {
            logger.error(e);
        }
    };
};
