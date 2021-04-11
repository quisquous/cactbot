import fs from 'fs';
import path from 'path';

export const walkDir = (dir: string, callback: (filename: string) => void): void => {
  if (fs.statSync(dir).isFile()) {
    callback(path.posix.join(dir));
    return;
  }
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.posix.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory)
      walkDir(dirPath, callback);
    else
      callback(path.posix.join(dir, f));
  });
};
