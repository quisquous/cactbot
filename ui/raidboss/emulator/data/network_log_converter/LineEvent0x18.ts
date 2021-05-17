import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import { LogRepository } from './LogRepository';

export type LineEvent0x18Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Target ID
  string, // 3: Target Name
  string, // 4: Type
  string, // 5: Effect ID
  string, // 6: Damage
  string, // 7: Current HP
  string, // 8: Max HP
  string, // 9: Current MP
  string, // 10: Max MP
  string, // 11: Current TP
  string, // 12: Max TP
  string, // 13: X
  string, // 14: Y
  string, // 15: Z
  string, // 16: Heading
  string, // 17: Unknown/Blank?
  string, // 18: Checksum
];

// DoT/HoT event
export class LineEvent0x18 extends LineEvent {
  id: string;
  name: string;
  type: string;
  effectId: string;
  damage: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  x: number;
  y: number;
  z: number;
  heading: number;
  resolvedName: string;
  effectName: string | undefined = '';
  properCaseConvertedLine = '';
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x18Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
    repo.updateCombatant(this.id, {
      job: undefined,
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.type = parts[4];
    this.effectId = parts[5].toUpperCase();
    this.damage = parseInt(parts[6], 16);

    this.hp = parseInt(parts[7]);
    this.maxHp = parseInt(parts[8]);

    this.mp = parseInt(parts[9]);
    this.maxMp = parseInt(parts[10]);

    this.x = parseFloat(parts[13]);
    this.y = parseFloat(parts[14]);
    this.z = parseFloat(parts[15]);
    this.heading = parseFloat(parts[16]);

    this.resolvedName = repo.resolveName(this.id, this.name);
  }

  convert(): void {
    if (this.effectId.toUpperCase() in LineEvent0x18.showEffectNamesFor)
      this.effectName = LineEvent0x18.showEffectNamesFor[this.effectId.toUpperCase()];
    let effectPart = '';
    if (this.effectName)
      effectPart = this.effectName + ' ';

    this.convertedLine = `\
${this.prefix()}\
${effectPart}\
${this.type} \
Tick on ${this.resolvedName} \
for ${this.damage} damage.`;

    this.properCaseConvertedLine = `\
${this.prefix()}\
${effectPart}\
${this.type} \
Tick on ${EmulatorCommon.properCase(this.resolvedName) as string} \
for ${this.damage} damage.`;
  }

  static showEffectNamesFor: Record<string, string> = {
    '4C4': 'Excognition',
    '35D': 'Wildfire',
    '1F5': 'Doton',
    '2ED': 'Salted Earth',
    '4B5': 'Flamethrower',
    '2E3': 'Asylum',
    '777': 'Asylum',
    '798': 'Sacred Soil',
    '4C7': 'Fey Union',
    '742': 'Nascent Glint',
  };
}

export class LineEvent24 extends LineEvent0x18 {}
