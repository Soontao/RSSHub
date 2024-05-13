const entry = Date.now();
const app = require("./app");
const config = require("./config").value;
const fs = require("fs");
const logger = require("./utils/logger");

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (require.main === module) {
  if (config.enableCluster && cluster.isMaster && process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "dev") {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  } else {
    let server;

    if (config.connect.socket) {
      if (fs.existsSync(config.connect.socket)) {
        fs.unlinkSync(config.connect.socket);
      }
      server = app.listen(config.connect.socket, parseInt(config.listenInaddrAny) ? null : "127.0.0.1");
      logger.info("Listening Unix Socket " + config.connect.socket);
      process.on("SIGINT", () => {
        fs.unlinkSync(config.connect.socket);
        process.exit();
      });
    }

    if (config.connect.port) {
      server = app.listen(config.connect.port, parseInt(config.listenInaddrAny) ? null : "127.0.0.1", () => {
        logger.info("Listening Port", { port: config.connect.port, ms: Date.now() - entry });
        logger.info("RSSHub started! Cheers!");
      });
    }

    module.exports = server;
  }
} else {
  const server = app.listen(); // random port
  module.exports = server;
}
