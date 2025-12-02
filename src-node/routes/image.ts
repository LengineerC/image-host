import express from "express";
import { fail, ok } from "../utils/ApiResponse";
import path from "path";
import { CURRENT_DIR, UPLOADS_DIRNAME } from "../utils/constants";
import configManager from "../config";
import scanDir from "../utils/scanDir";
import fs from 'fs';
import { authMiddleware } from "../middleware/auth";
import { uploadMiddleware } from "../middleware/upload";

const config = configManager.getConfig();
const router = express.Router();

router.post("/upload", authMiddleware, uploadMiddleware, (req, res) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json(fail("No file uploaded"));
  }

  const uploadRootDir = path.resolve(CURRENT_DIR, UPLOADS_DIRNAME);
  const protocol = req.protocol;
  const host = req.get("host");
  const baseUrl = config.baseUrl?.trim() || `${protocol}://${host}`;

  const results = files.map(file => {
    const relativePath = path.relative(
      uploadRootDir,
      file.path,
    ).replace(/\\/g, '/');
    const url = `${baseUrl}/uploads/${relativePath.replace(/\\/g, "/")}`;

    return {
      filename: file.filename,
      originName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: relativePath,
      url,
      uploadTime: Date.now(),
    };
  });

  return res.json(ok(results));
});

router.get('/images', authMiddleware, (req, res) => {
  try {
    const uploadRootDir = path.resolve(CURRENT_DIR, UPLOADS_DIRNAME);
    const protocol = req.protocol;
    const host = req.get("host");
    const baseUrl = config.baseUrl?.trim() || `${protocol}://${host}`;

    const images = scanDir(uploadRootDir);
    const result = images.map(img => {
      const url = `${baseUrl}/uploads/${img.path}`;

      return { ...img, url };
    });

    res.json(ok(result));
  } catch (err: any) {
    return res.status(500).json(fail(err.message));
  }
});

router.delete('/images', authMiddleware, (req, res) => {
  if (!req.body) {
    return res.status(400).json(fail('request body is not exists'));
  }

  const { paths } = req.body;

  if (!Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json(fail("paths must be a non-empty array"));
  }

  const uploadRootDir = path.resolve(CURRENT_DIR, UPLOADS_DIRNAME);
  const results = [];

  for (const p of paths) {
    const absPath = path.resolve(uploadRootDir, p);

    try {
      if (fs.existsSync(absPath)) {
        fs.unlinkSync(absPath)
        results.push({ path: p, success: true });
      } else {
        results.push({ path: p, success: false, error: "File does not exist" });
      }
    } catch (err: any) {
      results.push({ path: p, success: false, error: err.message });
    }
  }

  return res.json(ok({
    deleted: results,
  }));
});

router.get('/config', authMiddleware, (req, res) => {
  const configData = {
    fileSize: config.fileSize,
    maxUploadCount: config.maxUploadCount,
    token: config.token,
  };
  return res.json(ok(configData));
});

export default router;
