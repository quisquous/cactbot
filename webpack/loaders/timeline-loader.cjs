'use strict';

const commentRegex = /(?:^(?:[^"]*)#.*$|(?<=^[^"]*"[^"]*".*)#.*$)/i;

module.exports = function(content, map, meta) {
  let ret = '';

  content.split(/\r?\n/).forEach((_line) => {
    const line = _line.replace(commentRegex, '').trim();
    if (!line)
      return;
    ret += line + '\r\n';
  });

  return ret;
};
