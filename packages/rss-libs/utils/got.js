const logger = require("./logger");
const config = require("rss-libs/config").value;
const got = require("got");
const { CookieJar } = require("tough-cookie");

const cookieJar = new CookieJar();

const custom = got.extend({
  cookieJar,
  retry: config.requestRetry,
  hooks: {
    beforeRetry: [
      (options, err, count) => {
        logger.error(
          `Request ${options.url} fail, retry attempt #${count}: ${err}`,
        );
      },
    ],
    afterResponse: [
      (response) => {
        try {
          response.data = JSON.parse(response.body);
        } catch (e) {
          response.data = response.body;
        }
        response.status = response.statusCode;
        return response;
      },
    ],
    init: [
      (options) => {
        // compatible with axios api
        if (options && options.data) {
          options.body = options.body || options.data;
        }
      },
    ],
  },
  headers: {
    "user-agent": config.ua,
  },
});
custom.all = (list) => Promise.all(list);

module.exports = custom;
