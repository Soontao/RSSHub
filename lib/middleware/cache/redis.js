const config = require('@/config').value;
const logger = require('@/utils/logger');
const { Cache } = require('./base');


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

    async get(key) {
        if (key && this.connected) {
            let value = await this.client.get(key);
            if (value) {
                value = value + '';
            }
            return value;
        }
    }

    ready() {
        return this.connected;
    }

    set(key, value, maxAge = config.cache.contentExpire) {
        logger.debug(`set cache: [${key}] with age [${maxAge}]`);
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

module.exports = { RedisCache };
