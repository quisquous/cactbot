import fs from 'fs';
import path from 'path';

const recurseDir = (dir: string): string[] => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((file) => {
      const relPath = path.join(dir, file.name);
      if (file.isDirectory())
        return recurseDir(relPath);
      return relPath;
    });
};

const ignorePathRegexes = [
  /(?:^|\/)\w*_manifest\.txt$/,
  /(?:^|\/)readme\.\w*$/i,
];

const findManifestFiles = (dir: string): string[] => {
  const actualDir = fs.lstatSync(dir).isFile() ? path.dirname(dir) : dir;
  return recurseDir(actualDir)
    .map((file) => path.relative(actualDir, file))
    // Exclude specific paths
    .filter((file) => !ignorePathRegexes.some((regex) => regex.test(file)));
};

export default findManifestFiles;
