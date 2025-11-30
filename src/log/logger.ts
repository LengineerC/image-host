import log4js from "log4js";

log4js.configure({
  appenders: {
    stdout: { type: 'stdout' },
    file: {
      type: "file",
      filename: "logs/access.log",
      maxLogSize: 10485760,
      backups: 3,
    },
  },
  categories: {
    default: { appenders: ["stdout", "file"], level: "info" },
  },
});

export const logger = log4js.getLogger();
