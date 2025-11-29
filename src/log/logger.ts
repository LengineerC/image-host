import log4js from "log4js";

log4js.configure({
  appenders: {
    console: { type: "console" },
    file: {
      type: "file",
      filename: "logs/access.log",
      maxLogSize: 10485760,
      backups: 3,
    },
  },
  categories: {
    default: { appenders: ["console", "file"], level: "info" },
  },
});

export const logger = log4js.getLogger();
