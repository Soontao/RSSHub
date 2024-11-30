const config = require("rss-libs/config").value;
const Parser = require("rss-parser");

const parser = new Parser({
  customFields: {
    item: ["magnet"],
  },
  headers: {
    "User-Agent": config.ua,
  },
});

module.exports = parser;
