'use strict';

const commentRegex = /(?<=^(?:[^"/]*(?:|"[^"]*"))[^"/]*(?:|sync\s*\/[^/]*\/[^"/]*))#.*$/i;

module.exports = function(content, map, meta) {
  this.cacheable(true);
  let ret = '';

  content.split(/\r?\n/).forEach((_line) => {
    const line = _line.replace(commentRegex, '').trim();
    if (!line)
      return;
    ret += line + '\r\n';
  });

  return ret;
};
