import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';

import eslint from 'eslint';

import UserConfig from '../resources/user_config';
import { LooseTriggerSet } from '../types/trigger';
import defaultRaidbossOptions from '../ui/raidboss/raidboss_options';

import { walkDirAsync } from './file_utils';

const root = '../dist/triggers/ui/raidboss/data/';

const outputFileToOrigFile = (distFile: string): string => {
  return distFile.replace(root, 'ui/raidboss/data/');
};

const tscCmd = `${['..', 'node_modules', '.bin', 'tsc'].join(path.sep)} --build ${
  ['..', 'tsconfig.triggers.json'].join(path.sep)
}`;

// Probably we could do this more cleanly with babel, but we'll just regex for simplicitly.
const removeImports = (lines: string[]) => {
  // You can't import in a user file, so remove these lines.
  // TODO: we really should test that all imports are ones that can be used in eval.
  return lines.filter((line) => {
    if (/^export default triggerSet;/.exec(line))
      return false;
    if (/^import /.exec(line))
      return false;
    return true;
  });
};

const removeExportOnDeclarations = (lines: string[]) => {
  return lines.map((line) => {
    if (!/^export const /.exec(line))
      return line;
    return line.replace(/^export /, '');
  });
};

const changeExportToPush = (lines: string[]) => {
  // User files are not modules and so push onto a global Options variable rather than
  // exporting, so modify these files so that they can be used directly as user files.
  const exportRegex = /^(?:export default {|const triggerSet = {)\s*/;
  const closingRegex = /^};\s*$/;

  let replacedExportCount = 0;
  let replacedClosingCount = 0;
  lines = lines.map((line) => {
    if (exportRegex.exec(line)) {
      replacedExportCount++;
      line = line.replace(exportRegex, 'Options.Triggers.push({');
    }
    // Function definitions that match closingRegex can happen before the export line.
    if (replacedExportCount && closingRegex.exec(line)) {
      replacedClosingCount++;
      line = line.replace(closingRegex, '});');
    }
    return line;
  });

  if (replacedExportCount !== 1 || replacedClosingCount !== 1) {
    console.error(
      `Found ${replacedExportCount} export lines and ${replacedClosingCount} closing lines, aborting.`,
    );
    process.exit(3);
  }

  return lines;
};

const lint = async (filename: string, lines: string[]) => {
  const dprintLinter = new eslint.ESLint({ fix: true });

  const config = JSON.parse(
    JSON.stringify(await dprintLinter.calculateConfigForFile(filename)),
  ) as eslint.Linter.Config<eslint.Linter.RulesRecord>;
  config.plugins = config.plugins?.filter((p) => p !== 'dprint');
  delete config?.rules?.['dprint/dprint'];

  // Run without dprint first, because dprint is slow on unformatted files.
  const linter = new eslint.ESLint({ fix: true, useEslintrc: false, baseConfig: config });
  const contents = lines.join('\n');
  const eslintResults = await linter.lintText(contents, { filePath: filename });
  const eslintLintResult = eslintResults[0];
  if (!eslintLintResult?.output || eslintLintResult.errorCount > 0) {
    console.error('Lint (eslint) ran with errors, aborting.');
    return eslintLintResult;
  }

  // Run again with dprint to get a finalized version.
  const results = await dprintLinter.lintText(eslintLintResult.output, { filePath: filename });
  const lintResult = results[0];
  // If dprint didn't have anything to change, the output is undefined, so return the results
  // of the previous lint.
  if (!lintResult?.output)
    return eslintLintResult;

  // There's only one result from lintText, as per documentation.
  return lintResult;
};

const processFile = async (filename: string) => {
  console.error(`Processing file: ${filename}`);
  const originalContents = fs.readFileSync(filename).toString();
  const originalFilename = outputFileToOrigFile(filename);
  let lines = originalContents.split(/[\r\n]+/);

  lines = removeImports(lines);
  lines = changeExportToPush(lines);
  lines = removeExportOnDeclarations(lines);
  const lintResult = await lint(originalFilename, lines);
  if (!lintResult) {
    console.error('${filename}: No result from linting?');
    process.exit(2);
  }

  const ignoreRules = [
    // ES2020 -> ES2019 rewriting of optional chaining (i.e. `?.`) turns into this.
    'no-cond-assign',
    // Often tsc will combine lines (even across existing linebreaks) violating this.
    'max-len',
  ];
  const messages = lintResult.messages.filter((message) => {
    if (!message.ruleId)
      return true;
    return !ignoreRules.includes(message.ruleId);
  });

  // lintResult.errorCount exists, but we need a recount after ignoring some rules.
  const numErrors = messages.filter((x) => x.severity === 2).length;
  const numWarnings = messages.filter((x) => x.severity === 1).length;

  if (numErrors > 0) {
    console.error(`${filename}: Lint ran with errors: ${JSON.stringify(messages)}`);
    process.exit(3);
  } else if (numWarnings > 0) {
    // Print warnings, but don't stop.
    console.error(`${filename}: Lint ran with warnings: ${JSON.stringify(messages)}`);
  }

  const contents = lintResult.output;
  if (contents === undefined) {
    console.error(`${filename}: Lint returned no contents`);
    process.exit(4);
  }

  // Validate that our regex search/replace created a valid user file that can be eval'd.
  try {
    const options = { ...defaultRaidbossOptions };
    UserConfig.evalUserFile(contents, options);
  } catch (e) {
    console.error(`${filename}: Failed eval.`);
    console.log(e);
    process.exit(5);
  }

  // Overwrite the file.
  fs.writeFileSync(filename, contents);

  // Copy timeline file if present
  const importPath = path.join(
    '..',
    originalFilename.replace(path.extname(originalFilename), '.ts'),
  );
  // Dynamic imports don't have a type, so add type assertion.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const triggerSet = (await import(importPath)).default as LooseTriggerSet;
  const timelineFilename = triggerSet?.timelineFile;
  if (timelineFilename) {
    const timelineFile = path.join(path.dirname(importPath), timelineFilename);
    if (fs.existsSync(timelineFile)) {
      const destination = path.join(path.dirname(filename), timelineFilename);
      fs.copyFileSync(timelineFile, destination);
    }
  }
};

const processAllFiles = async (root: string, tscCmd: string) => {
  process.chdir(path.dirname(process.argv[1] ?? ''));

  // Clean up previous directory so tsc doesn't ignore them.
  fs.rmSync(root, { recursive: true, force: true });

  // Generate javascript from typescript.
  // TODO: replace this with programatic use of TypeScript API.
  try {
    execSync(tscCmd);
  } catch (e) {
    console.error(`Failed to run ${tscCmd}`);
    console.error(e);
    process.exit(6);
  }

  // Process files.
  await walkDirAsync(root, async (filename) => processFile(filename));
  process.exit(0);
};

void processAllFiles(root, tscCmd);
