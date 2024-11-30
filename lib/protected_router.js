const Router = require("@koa/router");
const router = new Router();
const auth = require("koa-basic-auth");
const config = require("rss-libs/config").value;

router.use("/(.*)", auth(config.authentication));

// RSSHub
router.get("/rsshub/routes", require("./routes/rsshub/routes"));

module.exports = router;
