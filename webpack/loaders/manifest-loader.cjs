'use strict';

const fs = require('fs');

module.exports = function(content, map, meta) {
  const contents = fs.readFileSync(this.resourcePath).toString();
  const lines = contents.trim().split(/\s*[\r\n]+\s*/);

  let importStr = '';
  let outputStr = 'export default {';

  for (const fileIdx in lines) {
    // normalize filepaths between windows / unix
    const name = lines[fileIdx].replace(/\\/g, '/').replace(/^\//, '');

    // Use static imports instead of dynamic ones to put files in the bundle.
    const fileVar = `file${fileIdx}`;
    importStr += `import ${fileVar} from './${name}';\n`;
    outputStr += `'${name}': ${fileVar},`;
  }

  outputStr += '};';

  return `${importStr}\n${outputStr}`;
};
