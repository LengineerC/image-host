import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./log/logger";
import {
  CURRENT_DIR,
  UPLOADS_DIRNAME,
} from "./utils/constants";
import router from "./routes/image";
import configRouter from "./routes/config";
import configManager from "./config/index";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: {
      write(msg) {
        const logMsg = msg.trim();
        const statusMatch = msg.match(/"\s+(\d+)\s+/);
        if (statusMatch) {
          const statusCode = parseInt(statusMatch[1]);

          if (statusCode >= 500) logger.error(logMsg);
          else if (statusCode >= 400) logger.warn(logMsg);
          else logger.info(logMsg);
        } else {
          logger.info(logMsg);
        }
      },
    },
  }),
);

const config = configManager.getConfig();

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, '../client')));

  app.get('/', (_, res) => {
    const indexPage = path.join(__dirname, '../client/index.html');
    res.sendFile(indexPage);
  });
}

app.use("/uploads", express.static(path.resolve(CURRENT_DIR, UPLOADS_DIRNAME)));
app.use("/api", router);
app.use("/api", configRouter);

app.listen(config.serverPort, () => {
  logger.info(`Server listening on port: ${config.serverPort}`);
});
