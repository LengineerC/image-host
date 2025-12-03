import express from "express";
import { ok } from "../utils/ApiResponse";
import configManager from "../config";
import { authMiddleware } from "../middleware/auth";

const config = configManager.getConfig();
const router = express.Router();

router.get('/config', authMiddleware, (req, res) => {
  const configData = {
    fileSize: config.fileSize,
    maxUploadCount: config.maxUploadCount,
    token: config.token,
  };
  return res.json(ok(configData));
});

export default router;