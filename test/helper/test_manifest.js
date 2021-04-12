import fs from 'fs';
import path from 'path';
import chai from 'chai';
import { walkDirSync } from '../../util/file_utils';
const { assert } = chai;

const testManifestFile = (file) => {
  let manifestLines;
  const dirList = [];

  before(async () => {
    const contents = fs.readFileSync(file) + '';
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
    /(?:^|\/)manifest\.txt$/,
    /(?:^|\/)readme\.\w*$/i,
  ];

  const shouldIgnoreFile = (file) => {
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
      // All files must be .js and .txt.
      if (/\.txt$/.test(file) || /\.js$/.test(file))
        continue;
      assert.fail(`${file} has invalid extension`);
    }
  });
};

const testManifestFiles = (manifestFiles) => {
  describe('manifest test', () => {
    for (const file of manifestFiles)
      describe(`${file}`, () => testManifestFile(file));
  });
};

export default testManifestFiles;
