import fs from 'fs';
import path from 'path';

import { assert } from 'chai';

import { walkDirSync } from '../../util/file_utils';

const testManifestFile = (file: string) => {
  let manifestLines: string[];
  const dirList: string[] = [];

  before((): void => {
    const contents = fs.readFileSync(file).toString();
    // Split into lines, skipping any blank lines and trimming whitespace.
    manifestLines = contents.split('\n').filter((x) => !/^\s*$/.test(x)).map((x) => x.trim());

    const basePath = path.dirname(file);
    walkDirSync(basePath, (filePath) => {
      const relative = path.relative(basePath, filePath);
      // Manifests use forward slashes, so match that here.
      const withForwardSlashes = relative.replace(/\\/g, '/');
      dirList.push(withForwardSlashes);
    });
  });

  const ignorePathRegexes = [
    /(?:^|\/)\w*_manifest\.txt$/,
    /(?:^|\/)readme\.\w*$/i,
  ];

  const shouldIgnoreFile = (file: string) => {
    for (const regex of ignorePathRegexes) {
      if (regex.test(file))
        return true;
    }
    return false;
  };

  it('all files on disk in manifest', () => {
    for (const file of dirList) {
      if (shouldIgnoreFile(file))
        continue;
      assert.include(manifestLines, file);
    }
  });

  it('all files in manifest on disk', () => {
    for (const file of manifestLines)
      assert.include(dirList, file);
  });

  it('correct file types in manifest', () => {
    for (const file of manifestLines) {
      // All files must be .js/.ts and .txt.
      if (/\.txt$/.test(file) || /\.[jt]s$/.test(file))
        continue;
      assert.fail(`${file} has invalid extension`);
    }
  });
};

const testManifestFiles = (manifestFiles: string[]): void => {
  describe('manifest test', () => {
    for (const file of manifestFiles)
      describe(`${file}`, () => testManifestFile(file));
  });
};

export default testManifestFiles;
