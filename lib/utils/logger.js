const { resolve } = require("path");
const winston = require("winston");
const config = require("@/config").value;

let transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
    silent: process.env.NODE_ENV === "test",
  }),
];
if (!config.noLogfiles) {
  transports = [
    new winston.transports.File({
      filename: resolve("logs/error.log"),
      level: "error",
    }),
    new winston.transports.File({ filename: resolve("logs/combined.log") }),
  ];
}
const logger = winston.createLogger({
  level: config.loggerLevel,
  format: winston.format.json(),
  transports: transports,
});

module.exports = logger;
