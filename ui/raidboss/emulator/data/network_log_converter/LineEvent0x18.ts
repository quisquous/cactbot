import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  type: 4,
  effectId: 5,
  damage: 6,
  currentHp: 7,
  maxHp: 8,
  currentMp: 9,
  maxMp: 10,
  currentTp: 11,
  maxTp: 12,
  x: 13,
  y: 14,
  z: 15,
  heading: 16,
} as const;

// DoT/HoT event
export class LineEvent0x18 extends LineEvent {
  public readonly properCaseConvertedLine: string;

  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public readonly effectId: string;
  public readonly damage: number;
  public readonly currentHp: number;
  public readonly maxHp: number;
  public readonly currentMp: number;
  public readonly maxMp: number;
  public readonly currentTp: number;
  public readonly maxTp: number;
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  public readonly heading: number;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';

    this.type = parts[fields.type] ?? '';
    this.effectId = parts[fields.effectId]?.toUpperCase() ?? '';
    this.damage = parseInt(parts[fields.damage] ?? '', 16);

    this.currentHp = parseInt(parts[fields.currentHp] ?? '');
    this.maxHp = parseInt(parts[fields.maxHp] ?? '');
    this.currentMp = parseInt(parts[fields.currentMp] ?? '');
    this.maxMp = parseInt(parts[fields.maxMp] ?? '');
    this.currentTp = parseInt(parts[fields.currentTp] ?? '');
    this.maxTp = parseInt(parts[fields.maxTp] ?? '');
    this.x = parseFloat(parts[fields.x] ?? '');
    this.y = parseFloat(parts[fields.y] ?? '');
    this.z = parseFloat(parts[fields.z] ?? '');
    this.heading = parseFloat(parts[fields.heading] ?? '');

    repo.updateCombatant(this.id, {
      job: undefined,
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    let effectName = '';
    const resolvedName = repo.resolveName(this.id, this.name);

    if (this.effectId in LineEvent0x18.showEffectNamesFor)
      effectName = LineEvent0x18.showEffectNamesFor[this.effectId] ?? '';

    let effectPart = '';
    if (effectName)
      effectPart = effectName + ' ';

    this.convertedLine = this.prefix() + effectPart + this.type +
      ' Tick on ' + resolvedName +
      ' for ' + this.damage.toString() + ' damage.';

    this.properCaseConvertedLine = this.prefix() + effectPart + this.type +
      ' Tick on ' + EmulatorCommon.properCase(resolvedName) +
      ' for ' + this.damage.toString() + ' damage.';
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

export class LineEvent24 extends LineEvent0x18 { }
