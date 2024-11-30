const path = require("path");
const fs = require("fs");
const Router = require("@koa/router");
const logger = require("rss-libs/utils/logger");
const router = new Router();

const dirItems = fs.readdirSync(__dirname);

for (const dirItem of dirItems) {
  const dirItemPath = path.join(__dirname, dirItem);
  if (!fs.statSync(dirItemPath).isDirectory()) {
    continue;
  }
  try {
    const endpoint = require(dirItemPath);
    const path = endpoint?.path ?? `/${dirItemPath}`;
    router.get(path, endpoint);
  } catch (error) {
    logger.error(`load module ${dirItemPath} failed.`);
    logger.error(error.message);
  }
}

module.exports = router;
