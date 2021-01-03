const config = require('@/config').value;
const { Cache } = require('./base');


class InMemoryCache extends Cache {

    constructor() {
        super();

        const NodeCache = require('node-cache');
        this.cache = new NodeCache({ checkperiod: 60, deleteOnExpire: true });

    }

    async get(key) {

        if (key === undefined || key === null) {
            return null;
        }

        if (key) {
            if (!this.cache.has(key)) {
                return null;
            }
            let value = this.cache.get(key);
            if (value) {
                value = value + '';
            }
            return value;
        }
    }

    async set(key, value, maxAge = config.cache.contentExpire) {
        super.set(key, value, maxAge);
        if (!value || value === 'undefined') {
            value = '';
        }
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        if (key) {
            return this.cache.set(key, value, maxAge);
        }
    }

}

module.exports = { InMemoryCache };