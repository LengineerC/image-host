import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./log/logger.ts";
import { CONFIG_FILENAME, CURRENT_DIR } from "./log/utils/constants.ts";
import ConfigManager from "./config/ConfigManager.ts";

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

const configPath = path.resolve(CURRENT_DIR, CONFIG_FILENAME);
const configManager = new ConfigManager(configPath);
configManager.readConfig();
const config = configManager.getConfig();

app.listen(config.serverPort, () => {
  logger.info(`Server listening on port: ${config.serverPort}`);
});
