const config = require("rss-libs/config").value;
const fs = require("fs/promises");
const { Cache } = require("./base");
const os = require("os");
const path = require("path");
const md5 = require("rss-libs/utils/md5");

const DEFAULT_OPTIONS = {
  basePath: os.tmpdir(),
  prefix: "rsshub_fs_cache_"
};

class FileSystemCache extends Cache {
  constructor(options = {}) {
    super();
    this._options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  _getPath(key) {
    return path.join(this._options.basePath, this._options.prefix + md5(key));
  }

  async get(key) {
    const file = this._getPath(key);
    const exists = await fs.access(file).then(() => true).catch(() => false);
    if (!exists) {
      return null;
    }
    const value = JSON.parse(await fs.readFile(file, "utf-8"));
    if (value.expireAt < Date.now()) {
      await fs.unlink(file);
      return null;
    }
    return value.value;
  }

  async set(key, value, maxAge = config.cache.contentExpire) {
    const file = this._getPath(key);
    const expireAt = Date.now() + maxAge * 1000;
    await fs.writeFile(file, JSON.stringify({ value, expireAt }), "utf-8");
  }
}

module.exports = { FileSystemCache };
