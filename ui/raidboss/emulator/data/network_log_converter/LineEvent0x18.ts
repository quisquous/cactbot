import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import LogRepository from './LogRepository';

// DoT/HoT event
export class LineEvent0x18 extends LineEvent {
  public resolvedName: string;
  public effectName: string | undefined = '';
  public properCaseConvertedLine = '';

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    repo.updateCombatant(this.id, {
      job: undefined,
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.resolvedName = repo.resolveName(this.id, this.name);
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[3] ?? '';
  }

  public get type(): string {
    return this.parts[4] ?? '';
  }

  public get effectId(): string {
    return this.parts[5]?.toUpperCase() ?? '';
  }

  public get damage(): number {
    return parseInt(this.parts[6] ?? '', 16);
  }

  public get currentHp(): number {
    return parseInt(this.parts[7] ?? '');
  }

  public get maxHp(): number {
    return parseInt(this.parts[8] ?? '');
  }

  public get currentMp(): number {
    return parseInt(this.parts[9] ?? '');
  }

  public get maxMp(): number {
    return parseInt(this.parts[10] ?? '');
  }

  public get currentTp(): number {
    return parseInt(this.parts[11] ?? '');
  }

  public get maxTp(): number {
    return parseInt(this.parts[12] ?? '');
  }

  public get x(): number {
    return parseFloat(this.parts[13] ?? '');
  }

  public get y(): number {
    return parseFloat(this.parts[14] ?? '');
  }

  public get z(): number {
    return parseFloat(this.parts[15] ?? '');
  }

  public get heading(): number {
    return parseFloat(this.parts[16] ?? '');
  }

  convert(_: LogRepository): void {
    if (this.effectId.toUpperCase() in LineEvent0x18.showEffectNamesFor)
      this.effectName = LineEvent0x18.showEffectNamesFor[this.effectId.toUpperCase()];
    let effectPart = '';
    if (this.effectName)
      effectPart = this.effectName + ' ';

    this.convertedLine = this.prefix() + effectPart + this.type +
      ' Tick on ' + this.resolvedName +
      ' for ' + this.damage.toString() + ' damage.';

    this.properCaseConvertedLine = this.prefix() + effectPart + this.type +
      ' Tick on ' + EmulatorCommon.properCase(this.resolvedName) +
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
