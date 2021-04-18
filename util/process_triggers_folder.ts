import { execSync } from 'child_process';
import eslint from 'eslint';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { walkDirAsync } from './file_utils';

const root = '../dist/triggers/ui/raidboss/data/';
const tscCmd = `${['..', 'node_modules', '.bin', 'tsc'].join(path.sep)} --build ${['..', 'tsconfig_triggers.json'].join(path.sep)}`;

// Probably we could do this more cleanly with babel, but we'll just regex for simplicitly.
const removeImports = (lines: string[]) => {
  // You can't import in a user file, so remove these lines.
  // TODO: we really should test that all imports are ones that can be used in eval.
  return lines.filter((line) => !/^import /.exec(line));
};

const changeExportToPush = (lines: string[]) => {
  // User files are not modules and so push onto a global Options variable rather than
  // exporting, so modify these files so that they can be used directly as user files.
  const exportRegex = /^export default {\s*/;
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
    console.error(`Found ${replacedExportCount} export lines and ${replacedClosingCount} closing lines, aborting.`);
    process.exit(3);
  }

  return lines;
};

const lintToFile = async (lines: string[], outputFileName: string) => {
  const linter = new eslint.ESLint({ fix: true });
  const contents = lines.join('\n');
  // Deliberately don't pass filename here, as dist/ is ignored in eslint.
  const results = await linter.lintText(contents);

  // There's only one result from lintText, as per documentation.
  const lintResult = results[0];
  if (!lintResult) {
    console.error('No result from linting?');
    process.exit(2);
  }
  if (lintResult.errorCount > 0 || lintResult.warningCount > 0) {
    // Errors aren't great, but tsc can create unfixable line length errors, so ignore them.
    console.error(`Lint ran with errors: ${JSON.stringify(lintResult.messages)}`);
  }

  // Overwrite the file, if it already exists.
  fs.writeFileSync(outputFileName, lintResult.output);
};

const processFile = async (filename: string) => {
  console.log(`Processing file: ${filename}`);
  const originalContents = fs.readFileSync(filename).toString();
  let lines = originalContents.split(/[\r\n]+/);

  lines = removeImports(lines);
  lines = changeExportToPush(lines);
  await lintToFile(lines, filename);
};

const processAllFiles = async (root: string, tscCmd: string) => {
  process.chdir(path.dirname(process.argv[1] ?? ''));

  // Clean up previous directory so tsc doesn't ignore them.
  fs.rmdirSync(root, { recursive: true });

  // Generate javascript from typescript.
  // TODO: replace this with programatic use of TypeScript API.
  execSync(tscCmd);

  // Process files.
  await walkDirAsync(root, async (filename) => processFile(filename));
  process.exit(0);
};

void processAllFiles(root, tscCmd);
