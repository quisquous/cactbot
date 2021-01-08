'use strict';

module.exports = function(content, map, meta) {
  let ret = '';

  content.split(/\r?\n/).forEach((_line) => {
    let line = _line.trim();
    if (!line || line.startsWith('#'))
      return;
    line = line.replace(/#.*$/, '').trim();
    ret += line + '\r\n';
  });

  return ret;
};
