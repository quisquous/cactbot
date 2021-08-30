import logDefinitions from '../../../../../resources/netlog_defs';
import EmulatorCommon from '../../EmulatorCommon';

import LineEvent, { LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.NetworkDoT.fields;

// DoT/HoT event
export class LineEvent0x18 extends LineEvent implements LineEventSource {
  public readonly id: string;
  public readonly name: string;
  public readonly type: string;
  public readonly effectId: string;
  public readonly damage: number;
  public readonly hp: number;
  public readonly maxHp: number;
  public readonly mp: number;
  public readonly maxMp: number;
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  public readonly heading: number;
  public readonly isSource = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';

    this.type = parts[fields.type] ?? '';
    this.effectId = parts[fields.effectId]?.toUpperCase() ?? '';
    const damageString = parts[fields.damage] ?? '';
    this.damage = parseInt(damageString, 16);

    this.hp = parseInt(parts[fields.currentHp] ?? '');
    this.maxHp = parseInt(parts[fields.maxHp] ?? '');
    this.mp = parseInt(parts[fields.currentMp] ?? '');
    this.maxMp = parseInt(parts[fields.maxMp] ?? '');
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

    const damageStringConverted = isNaN(this.damage) ? damageString : this.damage.toString();

    this.convertedLine = this.prefix() + effectPart + this.type +
      ' Tick on ' + EmulatorCommon.properCase(resolvedName) +
      ' for ' + damageStringConverted + ' damage.';
  }

  static showEffectNamesFor: { [effectId: string]: string } = {
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
