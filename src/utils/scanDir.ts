import fs from 'fs';
import path from 'path';

export interface ImageInfo {
  filename: string,
  size: number,
  path: string,
  uploadTime: number
}

export default function scanDir(rootPath: string) {
  const result: ImageInfo[] = [];

  function scan(dir: string) {
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scan(fullPath);
      } else {
        const relativePath = path.relative(rootPath, fullPath).replace(/\\/g, '/');

        result.push({
          filename: file,
          path: relativePath,
          size: stat.size,
          uploadTime: stat.birthtimeMs,
        });
      }
    }
  }

  if(!fs.existsSync(rootPath)) return [];

  scan(rootPath);
  return result;
}