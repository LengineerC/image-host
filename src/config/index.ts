import path from "path";
import { CONFIG_FILENAME, CURRENT_DIR } from "../utils/constants";
import ConfigManager from "./ConfigManager";

const configPath = path.resolve(CURRENT_DIR, CONFIG_FILENAME);
const configManager = ConfigManager.getInstance(configPath);

export default configManager;
