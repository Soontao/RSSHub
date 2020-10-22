/* eslint-disable no-unused-vars */
const config = require('@/config').value;
const logger = require('@/utils/logger');
const { LRUMap } = require('@newdash/newdash/functional/LRUMap');
const { Mutex } = require('@newdash/newdash/functional/Semaphore');

class Cache {

    constructor() {
        this.locks = new LRUMap(1024);
    }

    async tryGet(key, provider, maxAge = config.cache.contentExpire) {

        if (key === undefined) {
            throw new TypeError('tryGet value with [undefined] key');
        }
        if (provider === undefined) {
            throw new TypeError('tryGet value with [undefined] getValueFunc');
        }

        if (!this.locks.has(key)) {
            this.locks.set(key, new Mutex());
        }

        /**
         * @type {Mutex}
         */
        const lock = this.locks.get(key);

        return lock.use(async () => {

            let v = await this.get(key);
            if (!v) {
                const t1 = new Date().getTime();
                logger.debug(`retrieving: [${key}]`,);
                v = await provider(key);
                const retrieveDuration = (new Date().getTime() - t1);
                if (retrieveDuration > (config.longWarningThreshold * 1000)) {
                    logger.warn(`retrieve time too long [${retrieveDuration}] milliseconds: [${key}]`);
                } else {
                    logger.debug(`retrieve time [${retrieveDuration}] milliseconds: [${key}]`);
                }
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
        });


    }

    async syncReady() {
        return true;
    }

    ready() { return true; }

    set(key, value, maxAge) { logger.debug(`set cache [age:${maxAge} seconds]: [${key}]`); return null; }

    get(key) { return null; }
}

module.exports = { Cache };
