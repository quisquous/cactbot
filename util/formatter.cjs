/**
 * @prettier
 */
'use strict';
const fs = require('fs');

const eslint = require('eslint');
const prettier = require('prettier');

const path = require('path');

const format = async (code, filepath) => {
  const options = await prettier.resolveConfig(filepath);
  return prettier.format(code, { filepath, ...options });
};

const linter = new eslint.ESLint({
  fix: true,
  overrideConfig: {
    rules: {
      'indent': ['error', 2],
      'max-len': 'off',
      'curly': 'error',
      'brace-style': ['error'],
      'no-extra-parens': ['error', 'all', {
        'conditionalAssign': false,
        'nestedBinaryExpressions': false,
      }],
    },
  },
});

const lint = async (code, filePath) => {
  // Deliberately don't pass filename here, as dist/ is ignored in eslint.
  const results = await linter.lintText(code, { filePath });

  // There's only one result from lintText, as per documentation.
  return results[0];
};

const processFile = async (filename) => {
  // const ignore = fs.readFileSync(.toString().split('\n');
  const ignorePath = path.join(path.dirname(__dirname), '.prettierignore');
  const info = await prettier.getFileInfo(filename, { ignorePath });
  if (info.ignored) {
    return 0;
  }
  const originalContents = fs.readFileSync(filename).toString();
  if (!originalContents.includes('@prettier')) {
    console.log('to enable formatting, add this at the head of the file\n\n/**\n * @prettier\n */');
    return 0;
  }
  const lintResult = await lint(await format(originalContents, filename), filename);

  if (lintResult.output && lintResult.output !== originalContents) {
    fs.writeFileSync(filename, lintResult.output);
    return 1;
  }
  return 0;
};

const isChildOf = (child, parent) => {
  if (child === parent) {
    return false;
  }
  const parentTokens = parent.split('/').filter((i) => i.length);
  return parentTokens.every((t, i) => child.split('/')[i] === t);
};

const processAllFiles = async (filename) => {
  process.exit(await processFile(filename));
};

void processAllFiles(process.argv[2]);
