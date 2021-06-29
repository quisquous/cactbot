import fs from 'fs';
import path from 'path';

export const walkDirSync = (dir: string, callback: (filename: string) => void): void => {
  if (fs.statSync(dir).isFile()) {
    callback(path.posix.join(dir));
    return;
  }
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.posix.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory)
      walkDirSync(dirPath, callback);
    else
      callback(path.posix.join(dir, f));
  });
};

// Allows for an asynchronous callback, but still serializes them all
// and does not run them in parallel.
export const walkDirAsync = async (
  dir: string,
  callback: (filename: string) => Promise<void>,
): Promise<void> => {
  if (fs.statSync(dir).isFile()) {
    await callback(path.posix.join(dir));
    return;
  }
  const subdirs = fs.readdirSync(dir);
  for (const subdir of subdirs) {
    const dirPath = path.posix.join(dir, subdir);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    await (isDirectory ? walkDirAsync(dirPath, callback) : callback(dirPath));
  }
};
