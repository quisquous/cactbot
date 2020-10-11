'use strict';

class ParseLine {
  static parse(repo, line) {
    let ret;

    let parts = line.split('|');
    let event = parts[0];

    // Don't parse raw network packet lines
    if (event === '252')
      return false;

    // This is ugly, but just want to check if we have a specific
    // line class is defined without having a huge if/else or switch/case
    let tn = 'LineEvent' + event;
    if (eval('typeof(' + tn + ')') === 'function')
      eval('ret = new ' + tn + '(repo, line, parts);');
    else
      ret = new LineEvent(repo, line, parts);

    // Also don't parse lines with a non-sane date. This is 2000-01-01 00:00:00
    if (ret && ret.timestamp < 946684800)
      return false;

    // Finally, if the object marks itself as invalid, skip it
    if (ret && ret.invalid)
      return false;

    return ret;
  }
}

if (typeof module !== 'undefined' && module.exports)
  module.exports = ParseLine;
