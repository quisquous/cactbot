'use strict';

// Chat event
class LineEvent0x00 extends LineEvent {
  constructor(repo, line, parts) {
    super(repo, line, parts);
    if (this.parts.slice(4).join('|').split('\u001f\u001f').length > 1)
      this.invalid = true;
  }

  convert() {
    this.convertedLine =
      this.prefix() +
       this.parts[2] + ':' +
       // If speaker is blank, it's excluded from the converted line
       (this.parts[3] !== '' ? this.parts[3] + ':' : '') +
       this.parts.slice(4, this.parts.length - 1).join('|').trim();
    this.convertedLine = LineEvent00.replaceChatSymbols(this.convertedLine);
  }

  static replaceChatSymbols(line) {
    for (let rep of LineEvent00.chatSymbolReplacements)
      line = line.replace(rep.Search, rep.Replace);

    return line;
  }
}

class LineEvent00 extends LineEvent0x00 {}

LineEvent00.chatSymbolReplacements = [
  {
    Search: /:\uE06F/g,
    Replace: ':⇒',
    Type: 'Symbol',
  },
  {
    Search: / \uE0BB\uE05C/g,
    Replace: ' ',
    Type: 'Positive Effect',
  },
  {
    Search: / \uE0BB\uE05B/g,
    Replace: ' ',
    Type: 'Negative Effect',
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LineEvent0x00: LineEvent0x00,
    LineEvent00: LineEvent00,
  };
}
