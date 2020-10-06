/* eslint-disable no-unused-vars */
const config = require('@/config').value;
const logger = require('@/utils/logger');


class Cache {

    async tryGet(key, getValueFunc, maxAge = config.cache.contentExpire) {
        if (key === undefined) {
            throw new TypeError('tryGet value with [undefined] key');
        }
        if (getValueFunc === undefined) {
            throw new TypeError('tryGet value with [undefined] getValueFunc');
        }
        let v = await this.get(key);
        if (!v) {
            v = await getValueFunc(key);
            this.set(key, v, maxAge);
        } else {
            logger.debug(`get cache: ${key}`);
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
    set(key, value, maxAge) { return null; }
    get(key) { return null; }
}

module.exports = { Cache };
