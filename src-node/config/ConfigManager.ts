import { Config } from "./types";
import fs from "fs";

export default class ConfigManager {
  private static instance: ConfigManager | null = null;
  private defaultConfig: Config;
  private configPath: string;
  private config: Config;

  private constructor(configPath: string) {
    this.configPath = configPath;
    this.defaultConfig = {
      serverPort: 7500,
      fileSize: 5 * 1024 * 1024,
      baseUrl: '',
      maxUploadCount: 3,
      token: "91b4d142823f7d20c5f08df69122de43f35f057a988d9619f6d3138485c9a203", // 000000
    };
    this.config = this.defaultConfig;
    this.readConfig();
  }

  public static getInstance(configPath: string): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager(configPath);
    }
    return ConfigManager.instance;
  }

  public getConfig(): Config {
    return this.config;
  }

  public initConfig(): void {
    try {
      fs.writeFileSync(
        this.configPath,
        JSON.stringify(this.defaultConfig, null, 2),
      );
    } catch (err) {
      throw err;
    }
  }

  public readConfig() {
    try {
      if (!fs.existsSync(this.configPath)) this.initConfig();
      else {
        const configJson = fs.readFileSync(this.configPath).toString();
        this.config = JSON.parse(configJson);
      }
    } catch (err) {
      throw err;
    }
  }
}
