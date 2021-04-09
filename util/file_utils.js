import fs from 'fs';
import path from 'path';

export const walkDir = (dir, callback) => {
  if (fs.statSync(dir).isFile()) {
    callback(path.posix.join(dir));
    return;
  }
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.posix.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.posix.join(dir, f));
  });
};
