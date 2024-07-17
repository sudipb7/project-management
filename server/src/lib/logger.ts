import fs from "fs";
import path from "path";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

import { LOG_DIR } from "./config";

const logDir = path.join(__dirname, LOG_DIR);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = winston.format.printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    // debug log setting
    new winstonDaily({
      level: "debug",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/debug", // log file /logs/debug/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 7, // 7 Days saved
      json: false,
      zippedArchive: true,
    }),
    // error log setting
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 7, // 7 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
    // warn log setting
    new winstonDaily({
      level: "warn",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/warn", // log file /logs/warn/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 7, // 7 Days saved
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  })
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export { logger, stream };
