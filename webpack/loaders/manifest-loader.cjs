'use strict';

let fs = require('fs');

module.exports = function(content, map, meta) {
  const contents = fs.readFileSync(this.resourcePath).toString();
  const lines = contents.split(/[\r\n]+/);

  let fileIdx = 0;
  let importStr = '';
  let outputStr = 'export default {';

  for (let name of lines) {
    if (/^\s*$/.test(name))
      continue;
    name = name.replace(/\\/g, '/');
    name = name.replace(/^\//, '');

    // Use static imports instead of dynamic ones to put files in the bundle.
    const fileVar = `file${fileIdx++}`;
    importStr += `import ${fileVar} from './${name}';\n`
    outputStr += `'${name}': ${fileVar},`;
  }

  outputStr += '};';

  return `${importStr}\n${outputStr}`;
};

