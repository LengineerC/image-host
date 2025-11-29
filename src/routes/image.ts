import express from "express";
import upload from "../core/upload";
import { fail, ok } from "../utils/ApiResponse";
import path from "path";
import { CURRENT_DIR, UPLOADS_DIRNAME } from "../utils/constants";

const router = express.Router();

router.post("/upload", (req, res, next) => {
  upload.single("file")(req, res, (err: any) => {
    if (err) {
      return res.status(400).json(fail(err.message));
    }

    next();
  });
});
router.post("/upload", (req, res) => {
  if (!req.file) {
    return res.status(400).json(fail("No file uploaded"));
  }

  const file = req.file;

  const relativePath = path.relative(
    path.resolve(CURRENT_DIR, UPLOADS_DIRNAME),
    file.path,
  );

  const protocol = req.protocol;
  const host = req.get("host");
  const url = `${protocol}://${host}/uploads/${relativePath.replace(/\\/g, "/")}`;

  return res.json(
    ok({
      filename: file.filename,
      originName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: relativePath,
      url,
      uploadedAt: Date.now(),
    }),
  );
});

export default router;
