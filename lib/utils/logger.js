const console = require("console");

class Logger {
  info(...args) {
    console.log("INFO:", ...args);
  }
  warn(...args) {
    console.warn("WARN:", ...args);
  }
  error(...args) {
    console.error("ERROR:", ...args);
  }
  debug(...args) {
    if (!process.env.RSSHUB_DEBUG) {
      return;
    }
    console.debug("DEBUG:", ...args);
  }
}

module.exports = new Logger();
