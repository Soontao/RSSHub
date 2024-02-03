const config = require("@/config").value;
const logger = require("@/utils/logger");
const { Cache } = require("./base");

class RedisCache extends Cache {
  constructor(redisConfig = config.redis) {
    super();
    const Redis = require("redis");
    const {
      host: redisHost = "localhost",
      port: redisPort = 6379,
      url: redisUrl = `redis://${redisHost}:${redisPort}/`,
      options: redisOptions = {},
    } = redisConfig;
    if (!redisOptions.password) {
      delete redisOptions.password;
    }
    this.connected = false;
    this.client = Redis.createClient(redisUrl, redisOptions);
    this.client.on("error", (error) => {
      logger.error("Redis error: ", error);
    });
    this.client.on("end", () => {
      this.connected = false;
    });
    this.client.on("connect", () => {
      this.connected = true;
      logger.info("Redis connected.");
    });
  }

  async get(key) {
    if (key && this.connected) {
      return new Promise((resolve, reject) => {
        this.client.get(key, (err, value) => {
          if (err) {
            reject(err);
          } else {
            if (value) {
              value = value + "";
              resolve(value);
            } else {
              resolve(null);
            }
          }
        });
      });
    }
    return null;
  }

  async syncReady() {
    if (this.connected) {
      return true;
    }
    return new Promise((resolve, reject) => {
      this.client.on("error", reject);
      this.client.on("connect", resolve);
    });
  }

  ready() {
    return this.connected;
  }

  async set(key, value, maxAge = config.cache.contentExpire) {
    super.set(key, value, maxAge);
    if (!this.connected) {
      return;
    }
    if (!value || value === "undefined") {
      value = "";
    }
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    if (key) {
      return new Promise((resolve, reject) => {
        this.client.setex(key, maxAge, value, (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
        });
      });
    }
    return null;
  }
}

module.exports = { RedisCache };
