import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

// Player stats event
export class LineEvent0x0C extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);
  }

  public get class(): string {
    return this.parts[2] ?? '';
  }

  public get strength(): string {
    return this.parts[3] ?? '';
  }

  public get dexterity(): string {
    return this.parts[4] ?? '';
  }

  public get vitality(): string {
    return this.parts[5] ?? '';
  }

  public get intelligence(): string {
    return this.parts[6] ?? '';
  }

  public get mind(): string {
    return this.parts[7] ?? '';
  }

  public get piety(): string {
    return this.parts[8] ?? '';
  }

  public get attackPower(): string {
    return this.parts[9] ?? '';
  }

  public get directHit(): string {
    return this.parts[10] ?? '';
  }

  public get criticalHit(): string {
    return this.parts[11] ?? '';
  }

  public get attackMagicPotency(): string {
    return this.parts[12] ?? '';
  }

  public get healMagicPotency(): string {
    return this.parts[13] ?? '';
  }

  public get determination(): string {
    return this.parts[14] ?? '';
  }

  public get skillSpeed(): string {
    return this.parts[15] ?? '';
  }

  public get spellSpeed(): string {
    return this.parts[16] ?? '';
  }

  public get tenacity(): string {
    return this.parts[18] ?? '';
  }

  convert(_: LogRepository): void {
    this.convertedLine = this.prefix() +
      'Player Stats: ' + this.parts.slice(2, this.parts.length - 1).join(':').replace(/\|/g, ':');
  }
}

export class LineEvent12 extends LineEvent0x0C { }
