import webpack from 'webpack';

const commentRegex = /(?<=^(?:[^"/]*(?:|"[^"]*"))[^"/]*(?:|sync\s*\/[^/]*\/[^"/]*))#.*$/i;

export default function(this: webpack.LoaderContext<never>, content: string): string {
  this.cacheable(true);
  let ret = '';

  content.split(/\r?\n/).forEach((_line) => {
    const line = _line.replace(commentRegex, '').trim();
    if (!line)
      return;
    ret += line + '\r\n';
  });

  return ret;
}
