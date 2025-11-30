import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/ApiResponse";
import configManager from "../config";
import crypto from 'crypto';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['token'] as string | undefined;

  if (!token) {
    return res.status(401).json(fail('Unauthorized: token missing'));
  }

  const config = configManager.getConfig();
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  if (hash !== config.token) {
    return res.status(401).json(fail("Unauthorized: invalid token"));
  }

  next();
}
