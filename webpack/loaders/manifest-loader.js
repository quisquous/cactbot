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

  let output = 'module.exports = {';

  const fileMap = {};
  for await (const file of walk(dir)) {
    this.addDependency(file);
    let name = path.relative(dir, file);
    name = name.replace(/\\/g, '/');
    name = name.replace(/^\//, '');

    // Can't use JSON.stringify here because we want these values to be
    // JavaScript and not strings.
    output += `'${name}': require('./${name}'),`;
  }

  output += '};';

  callback(null, output, map, meta);
};
