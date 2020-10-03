const config = require('@/config').value;
const logger = require('@/utils/logger');
const { Cache } = require('./base');


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
        logger.debug(`set cache: [${key}] with age [${maxAge}]`);
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

module.exports = { InMemoryCache };