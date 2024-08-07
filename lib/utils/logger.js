const { padEnd } = require("@newdash/newdash");
const console = require("console");
const process = require("process");

const PADDING = 7;

class Logger {
  info(...args) {
    if (process.env.RSSHUB_TEST) {
      return;
    }
    console.log(padEnd("INFO:", PADDING), ...args);
  }
  warn(...args) {
    if (process.env.RSSHUB_TEST) {
      return;
    }
    console.warn(padEnd("WARN:", PADDING), ...args);
  }
  error(...args) {
    if (process.env.RSSHUB_TEST) {
      return;
    }
    console.error(padEnd("ERROR:", PADDING), ...args);
  }
  debug(...args) {
    if (process.env.RSSHUB_TEST) {
      return;
    }
    if (!process.env.RSSHUB_DEBUG) {
      return;
    }
    console.debug(padEnd("DEBUG:", PADDING), ...args);
  }
}

module.exports = new Logger();
