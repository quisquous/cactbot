import fs from 'fs';
import path from 'path';

import webpack from 'webpack';

// This is duplicated from util/manifest.ts
// For some reason webpack throws a `require() of ES modules is not supported.` error
// when trying to import? :shrug:
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

export default function(this: webpack.LoaderContext<never>, _content: string): string {
  this.cacheable(false);

  const lines = findManifestFiles(path.dirname(this.resourcePath));

  let importStr = '';
  let outputStr = 'export default {';

  lines.forEach((rawName, fileIdx) => {
    // normalize filepaths between windows / unix
    const name = rawName.replace(/\\/g, '/').replace(/^\//, '');

    // Use static imports instead of dynamic ones to put files in the bundle.
    const fileVar = `file${fileIdx}`;
    importStr += `import ${fileVar} from './${name}';\n`;
    outputStr += `'${name}': ${fileVar},`;
  });

  outputStr += '};';

  return `${importStr}\n${outputStr}`;
}
