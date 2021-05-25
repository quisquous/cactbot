import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  type: 2,
  speaker: 3,
} as const;

// Chat event
export class LineEvent0x00 extends LineEvent {
  public readonly type: string;
  public readonly speaker: string;
  public readonly message: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.type = parts[fields.type] ?? '';
    this.speaker = parts[fields.speaker] ?? '';
    this.message = parts.slice(4, -1).join('|');

    // The exact reason for this check isn't clear anymore but may be related to
    // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/250
    if (this.message.split('\u001f\u001f').length > 1)
      this.invalid = true;

    this.convertedLine =
      this.prefix() + this.type + ':' +
        // If speaker is blank, it's excluded from the converted line
        (this.speaker !== '' ? this.speaker + ':' : '') +
        this.message.trim();
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
