const Koa = require("koa");
const logger = require("rss-libs/utils/logger");

const onerror = require("rss-libs/middleware/onerror");
const header = require("rss-libs/middleware/header");
const utf8 = require("rss-libs/middleware/utf8");
const cache = require("rss-libs/middleware/cache");
const parameter = require("rss-libs/middleware/parameter");
const template = require("rss-libs/middleware/template");
const favicon = require("koa-favicon");
const debug = require("rss-libs/middleware/debug");
const accessControl = require("rss-libs/middleware/access-control");
const antiHotlink = require("rss-libs/middleware/anti-hotlink");

const router = require("./router");
const protected_router = require("./protected_router");
const mount = require("koa-mount");
const process = require("process");

// API related
const apiTemplate = require("rss-libs/middleware/api-template");
const api_router = require("./api_router");
const apiResponseHandler = require("rss-libs/middleware/api-response-handler");
const pure = require("rss-libs/middleware/pure");

process.on("uncaughtException", (e) => {
  logger.error("uncaughtException: " + e);
});

const app = new Koa();
app.proxy = true;

// favicon
app.use(favicon(__dirname + "/favicon.png"));

// global error handing
app.use(onerror);

app.use(accessControl);

// 7 debug
app.context.debug = {
  hitCache: 0,
  request: 0,
  etag: 0,
  paths: [],
  routes: [],
  ips: [],
  errorPaths: [],
  errorRoutes: [],
};
app.use(debug);

// 6 set header
app.use(header);

// 5 fix incorrect `utf-8` characters
app.use(utf8);

app.use(apiTemplate);
app.use(apiResponseHandler());

// 4 generate body
app.use(template);
// anti-hotlink
app.use(antiHotlink);

// 3 filter content
app.use(parameter);

// 2 cache
app.use(cache(app));

app.use(pure);

// router
app.use(mount("/", router.routes())).use(router.allowedMethods());

// routes the require authentication
app.use(mount("/protected", protected_router.routes())).use(protected_router.allowedMethods());

// API router
app.use(mount("/api", api_router.routes())).use(api_router.allowedMethods());

module.exports = app;
