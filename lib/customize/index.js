const path = require('path');
const fs = require('fs');
const Router = require('@koa/router');
const preFetchWrapper = require('@/utils/pre-fetch-wrapper');
const router = new Router();

const files = fs.readdirSync(__dirname);

files.forEach((file) => {
    const fPath = path.join(__dirname, file);
    if (fs.statSync(fPath).isDirectory()) {
        const { path, endpoint } = require(fPath);
        router.get(path, preFetchWrapper(endpoint));
    }
});

module.exports = router;
