const config = require('@/config').value;
const logger = require('@/utils/logger');


class Cache {

    async tryGet(key, getValueFunc, maxAge = config.cache.contentExpire) {
        let v = await this.get(key);
        if (!v) {
            v = await getValueFunc();
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
    set() { return null; }
    get() { return null; }
}

module.exports = { Cache };
