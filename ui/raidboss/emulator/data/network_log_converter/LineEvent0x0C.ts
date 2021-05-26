import LineEvent from './LineEvent';
import LogRepository from './LogRepository';

const fields = {
  class: 2,
  strength: 3,
  dexterity: 4,
  vitality: 5,
  intelligence: 6,
  mind: 7,
  piety: 8,
  attackPower: 9,
  directHit: 10,
  criticalHit: 11,
  attackMagicPotency: 12,
  healMagicPotency: 13,
  determination: 14,
  skillSpeed: 15,
  spellSpeed: 16,
  tenacity: 18,
} as const;

// Player stats event
export class LineEvent0x0C extends LineEvent {
  public readonly class: string;
  public readonly strength: string;
  public readonly dexterity: string;
  public readonly vitality: string;
  public readonly intelligence: string;
  public readonly mind: string;
  public readonly piety: string;
  public readonly attackPower: string;
  public readonly directHit: string;
  public readonly criticalHit: string;
  public readonly attackMagicPotency: string;
  public readonly healMagicPotency: string;
  public readonly determination: string;
  public readonly skillSpeed: string;
  public readonly spellSpeed: string;
  public readonly tenacity: string;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.class = parts[fields.class] ?? '';
    this.strength = parts[fields.strength] ?? '';
    this.dexterity = parts[fields.dexterity] ?? '';
    this.vitality = parts[fields.vitality] ?? '';
    this.intelligence = parts[fields.intelligence] ?? '';
    this.mind = parts[fields.mind] ?? '';
    this.piety = parts[fields.piety] ?? '';
    this.attackPower = parts[fields.attackPower] ?? '';
    this.directHit = parts[fields.directHit] ?? '';
    this.criticalHit = parts[fields.criticalHit] ?? '';
    this.attackMagicPotency = parts[fields.attackMagicPotency] ?? '';
    this.healMagicPotency = parts[fields.healMagicPotency] ?? '';
    this.determination = parts[fields.determination] ?? '';
    this.skillSpeed = parts[fields.skillSpeed] ?? '';
    this.spellSpeed = parts[fields.spellSpeed] ?? '';
    this.tenacity = parts[fields.tenacity] ?? '';

    this.convertedLine = this.prefix() +
      'Player Stats: ' + parts.slice(2, parts.length - 1).join(':').replace(/\|/g, ':');
  }
}

export class LineEvent12 extends LineEvent0x0C { }
