import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./log/logger.ts";
import {
  CURRENT_DIR,
  UPLOADS_DIRNAME,
} from "./utils/constants.ts";
import router from "./routes/image.ts";
import configManager from "./config/index.ts";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: {
      write(msg) {
        logger.info(msg.trim());
      },
    },
  }),
);

const config = configManager.getConfig();

app.use("/uploads", express.static(path.resolve(CURRENT_DIR, UPLOADS_DIRNAME)));
app.use("/api", router);

app.listen(config.serverPort, () => {
  logger.info(`Server listening on port: ${config.serverPort}`);
});
