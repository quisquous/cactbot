import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';

import eslint from 'eslint';

import UserConfig from '../resources/user_config';
import defaultRaidbossOptions from '../ui/raidboss/raidboss_options';

import { walkDirAsync } from './file_utils';

const root = '../dist/triggers/ui/raidboss/data/';
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

const lint = async (lines: string[]) => {
  const linter = new eslint.ESLint({ fix: true });
  const contents = lines.join('\n');
  // Deliberately don't pass filename here, as dist/ is ignored in eslint.
  const results = await linter.lintText(contents);

  // There's only one result from lintText, as per documentation.
  return results[0];
};

const processFile = async (filename: string) => {
  const originalContents = fs.readFileSync(filename).toString();
  let lines = originalContents.split(/[\r\n]+/);

  lines = removeImports(lines);
  lines = changeExportToPush(lines);
  lines = removeExportOnDeclarations(lines);
  const lintResult = await lint(lines);
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
