'use strict';
const fs = require('fs');
const path = require('path');

const lodash = require('lodash');
const fsExtra = require('fs-extra');
const { exec } = require('@actions/exec');

const pkg = require('../../package.json');

const projectRoot = path.join(__dirname, '..', '..');

async function main() {
  // force pwd to at .../cactbot/
  process.chdir(projectRoot);

  fs.rmSync('npm-package', { recursive: true, force: true });
  fs.rmSync('dist', { recursive: true, force: true });
  fs.mkdirSync('npm-package');

  await exec('npm run build', undefined, { env: { CI: '1' } });
  fs.renameSync('dist', 'npm-package/dist');

  await exec('npx tsc --declaration');
  fs.renameSync('dist/ui', 'npm-package/ui');
  fsExtra.copySync('types', 'npm-package/types', {});
  fs.renameSync('dist/resources', 'npm-package/resources');

  fs.writeFileSync(
    'npm-package/package.json',
    JSON.stringify(
      {
        ...lodash.pick(pkg, ['name', 'version', 'license', 'repository', 'files']),
        type: 'module',
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  throw e;
});
