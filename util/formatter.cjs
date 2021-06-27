/**
 * @prettier
 */
'use strict';
const fs = require('fs');
const path = require('path');

const { ArgumentParser } = require('argparse');
const eslint = require('eslint');
const prettier = require('prettier');

/**
 *
 * @param {string} code
 * @param {string} filepath
 * @returns {Promise<string>}
 */
const format = async (code, filepath) => {
  const options = await prettier.resolveConfig(filepath);
  return prettier.format(code, { filepath, ...options });
};

const linter = new eslint.ESLint({
  fix: true,
  overrideConfig: {
    rules: {
      'max-len': 'off',
      'indent': ['error', 2],
    },
  },
});

/**
 *
 * @param {string} code
 * @param {string} filePath
 * @returns {Promise<ESLint.LintResult>}
 */
const lint = async (code, filePath) => {
  // Deliberately don't pass filename here, as dist/ is ignored in eslint.
  const results = await linter.lintText(code, { filePath });

  // There's only one result from lintText, as per documentation.
  return results[0];
};

/**
 * @param {string} filename
 * @param {boolean} check
 */
const processFile = async (filename, check) => {
  // const ignore = fs.readFileSync(.toString().split('\n');
  const ignorePath = path.join(path.dirname(__dirname), '.prettierignore');
  const info = await prettier.getFileInfo(filename, { ignorePath });
  if (info.ignored) {
    console.log('skip formatting', filename);
    return 0;
  }

  const originalContents = fs.readFileSync(filename).toString();

  if (!filename.endsWith('.json') && !originalContents.includes('@prettier')) {
    console.log('skip formatting', filename);
    return 0;
  }

  const formatted = await format(originalContents, filename);

  let lintResult = formatted;

  if (!filename.endsWith('.json'))
    lintResult = await lint(formatted, filename);

  if (lintResult.output && lintResult.output !== originalContents) {
    if (!check)
      fs.writeFileSync(filename, lintResult.output);
    return 1;
  }
  return 0;
};

/**
 *
 * @param {string[]} files
 * @param {boolean} check
 * @returns {Promise<void>}
 */
const processAllFiles = async (files, check) => {
  const ret = await Promise.all(files.map((f) => processFile(f, check)));
  if (ret.filter((x) => x !== 0).length)
    process.exit(1);
};

const main = async () => {
  const parser = new ArgumentParser({
    description: 'Argparse example',
  });

  parser.addArgument(['-c', '--check'], { action: 'storeTrue' });
  parser.addArgument(['files'], {
    nargs: '+',
    defaultValue: '',
    type: 'string',
    help: 'Limits the results to only match specific files/path',
  });

  const { check, files } = parser.parseArgs();
  await processAllFiles(files, check);
};

void main();
