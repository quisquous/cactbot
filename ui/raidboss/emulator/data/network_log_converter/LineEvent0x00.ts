import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x00Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Type
  string, // 3: Speaker
  string, // 4: Message
  string, // 5: Checksum
];

// Chat event
export class LineEvent0x00 extends LineEvent {
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x00Parts) {
    super(repo, line, parts);
    if (this.parts.slice(4).join('|').split('\u001f\u001f').length > 1)
      this.invalid = true;
  }

  convert(): void {
    this.convertedLine =
      this.prefix() +
       this.parts[2] + ':' +
       // If speaker is blank, it's excluded from the converted line
       (this.parts[3] !== '' ? this.parts[3] + ':' : '') +
       this.parts.slice(4, this.parts.length - 1).join('|').trim();
    this.convertedLine = LineEvent00.replaceChatSymbols(this.convertedLine);
  }

  static replaceChatSymbols(line: string): string {
    for (const rep of LineEvent00.chatSymbolReplacements)
      line = line.replace(rep.Search, rep.Replace);

    return line;
  }

  static chatSymbolReplacements = [
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
}

export class LineEvent00 extends LineEvent0x00 {}
