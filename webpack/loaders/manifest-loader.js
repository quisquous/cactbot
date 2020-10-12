'use strict';

let fs = require('fs');
let path = require('path');

async function* walk(dir) {
  for await (const file of await fs.promises.opendir(dir)) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory())
      yield* walk(fullPath);
    if (file.isFile())
      yield fullPath;
  }
}

module.exports = async function(content, map, meta) {
  const callback = this.async();

  const dir = path.dirname(this.resourcePath);

  const fileMap = {};
  for await (const file of walk(dir)) {
    this.addDependency(file);
    let name = path.relative(dir, file);
    name = name.replace(/\\/g, '/');
    name = name.replace(/^\//, '');

    // TODO: also, maybe it'd be better to chain loaders here so we can minify this?
    const fileContents = await fs.promises.readFile(file, { encoding: 'utf8' });
    fileMap[name] = fileContents;
  }

  const output = `module.exports = ${JSON.stringify(fileMap)};`;

  callback(null, output, map, meta);
};
