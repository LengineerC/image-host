import path from "path";
import process from "process";

export const CURRENT_DIR =
  process.env.NODE_ENV === "development"
    ? process.cwd()
    : path.dirname(process.execPath);

export const CONFIG_FILENAME: string = "config.json";
