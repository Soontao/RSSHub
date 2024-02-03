const path = require("path");
const fs = require("fs");
const Router = require("@koa/router");
const logger = require("@/utils/logger");
const router = new Router();

const dirItems = fs.readdirSync(__dirname);

dirItems.forEach((dirItem) => {
  const dirItemPath = path.join(__dirname, dirItem);
  if (fs.statSync(dirItemPath).isDirectory()) {
    try {
      const endpoint = require(dirItemPath);
      const path = endpoint.path || `/${dirItemPath}`;
      router.get(path, endpoint);
    } catch (error) {
      logger.error(`load module ${dirItemPath} failed.`);
      logger.error(error);
    }
  }
});

module.exports = router;
