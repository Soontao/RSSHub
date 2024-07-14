const { padEnd } = require("@newdash/newdash");
const console = require("console");

const PADDING = 7;

class Logger {
  info(...args) {
    console.log(padEnd("INFO:", PADDING), ...args);
  }
  warn(...args) {
    console.warn(padEnd("WARN:", PADDING), ...args);
  }
  error(...args) {
    console.error(padEnd("ERROR:", PADDING), ...args);
  }
  debug(...args) {
    if (!process.env.RSSHUB_DEBUG) {
      return;
    }
    console.debug(padEnd("DEBUG:", PADDING), ...args);
  }
}

module.exports = new Logger();
