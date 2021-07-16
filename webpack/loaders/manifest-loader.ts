import fs from 'fs';

import webpack from 'webpack';

export default function(this: webpack.LoaderContext<never>, _content: string): string {
  this.cacheable(true);
  const contents = fs.readFileSync(this.resourcePath).toString();
  const lines = contents.trim().split(/\s*[\r\n]+\s*/);

  let importStr = '';
  let outputStr = 'export default {';

  lines.forEach((rawName, fileIdx) => {
    // normalize filepaths between windows / unix
    const name = rawName.replace(/\\/g, '/').replace(/^\//, '');

    // Use static imports instead of dynamic ones to put files in the bundle.
    const fileVar = `file${fileIdx}`;
    importStr += `import ${fileVar} from './${name}';\n`;
    outputStr += `'${name}': ${fileVar},`;
  });

  outputStr += '};';

  return `${importStr}\n${outputStr}`;
}
