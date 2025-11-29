import { Config } from "./types";
import fs from "fs";

export default class ConfigManager {
  private defaultConfig: Config;
  private configPath: string;
  private config: Config;

  public constructor(configPath: string) {
    this.configPath = configPath;
    this.defaultConfig = {
      serverPort: 3000,
    };
    this.config = this.defaultConfig;
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
