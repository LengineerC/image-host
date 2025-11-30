import { NextFunction, Request, Response } from "express";
import { fail } from "../utils/ApiResponse";
import upload from "../core/upload";

export function uploadMiddleware(req: Request, res: Response, next: NextFunction) {
  upload.array('files')(req, res, (err: any) => {
    if (err) {
      return res.status(400).json(fail(err.message));
    }

    next();
  });
}
