import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Chat event
export class LineEvent0x00 extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
    // The exact reason for this check isn't clear anymore but may be related to
    // https://github.com/ravahn/FFXIV_ACT_Plugin/issues/250
    if (this.message.split('\u001f\u001f').length > 1)
      this.invalid = true;
  }

  public get type(): string {
    return this.parts[2] ?? '';
  }

  public get speaker(): string {
    return this.parts[3] ?? '';
  }

  public get message(): string {
    return this.parts.slice(4, -1).join('|');
  }

  convert(_: LogRepository): void {
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
