import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x0CParts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Class
  string, // 3: Strength
  string, // 4: Dexterity
  string, // 5: Vitality
  string, // 6: Intelligence
  string, // 7: Mind
  string, // 8: Piety
  string, // 9: Attack Power
  string, // 10: Direct Hit
  string, // 11: Critical Hit
  string, // 12: Attack Magic Potency
  string, // 13: Heal Magic Potency
  string, // 14: Determination
  string, // 15: Skill Speed
  string, // 16: Spell Speed
  string, // 17: 0?
  string, // 18: Tenacity
  string, // 19: Unknown?
  string, // 20: Checksum
];

// Player stats event
export class LineEvent0x0C extends LineEvent {
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x0CParts) {
    super(repo, line, parts);
  }

  convert(): void {
    this.convertedLine = this.prefix() +
      'Player Stats: ' + this.parts.slice(2, this.parts.length - 1).join(':').replace(/\|/g, ':');
  }
}

export class LineEvent12 extends LineEvent0x0C {}
