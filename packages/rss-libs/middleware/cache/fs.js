const config = require("rss-libs/config").value;
const { Cache } = require("./base");
const os = require("os");
const path = require("path");
const sqlite3 = require("better-sqlite3")

const DEFAULT_OPTIONS = { basePath: os.tmpdir() };

class FileSystemCache extends Cache {
  constructor(options = {}) {
    super();
    this._options = Object.assign({}, DEFAULT_OPTIONS, options);
    this._cache = new sqlite3(path.join(this._options.basePath, "rsshub_cache.db"))
    this._cache.exec("CREATE TABLE IF NOT EXISTS CACHE (key TEXT PRIMARY KEY, value TEXT, expireAt INTEGER)")
    setInterval(this.clearOutdatedCache.bind(this), 1000 * 60).unref()
  }

  clearOutdatedCache() {
    this._cache.prepare("DELETE FROM CACHE WHERE expireAt < ?").run([Date.now()])
  }

  async get(key) {
    const row = this._cache.prepare("SELECT * FROM CACHE WHERE key = ? AND expireAt > ?").get([key, Date.now()])
    if (!row) {
      return null
    }
    return JSON.parse(row?.value ?? {})?.value
  }

  async set(key, value, maxAge = config.cache.contentExpire) {
    const expireAt = Date.now() + maxAge * 1000;
    this._cache.prepare("INSERT OR REPLACE INTO CACHE (key, value, expireAt) VALUES (?, ?, ?)").run([key, JSON.stringify({ value }), expireAt])
  }
}

module.exports = { FileSystemCache };
