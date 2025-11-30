import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { CURRENT_DIR, UPLOADS_DIRNAME } from "../utils/constants";
import configManager from "../config";

const config=configManager.getConfig();
const uploadRootDir = path.resolve(CURRENT_DIR, UPLOADS_DIRNAME);

function getTodayUploadDir() {
  const date = new Date();
  const folder = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  const uploadDir = path.resolve(uploadRootDir, folder);

  fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

function fileFilter(
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only images are allowed"));
  }
  cb(null, true);
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = getTodayUploadDir();
    cb(null, dir);
  },

  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.fileSize,
    files: config.maxUploadCount,
  },
});

export default upload;