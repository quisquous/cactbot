import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import Util from '../../../../../resources/util';
import LogRepository from './LogRepository';

// Added combatant event
export class LineEvent0x03 extends LineEvent {
  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: this.jobIdHex,
    });
  }

  public get id(): string {
    return this.parts[2]?.toUpperCase() ?? '';
  }

  public get name(): string {
    return this.parts[3] ?? '';
  }

  public get jobIdHex(): string {
    return this.parts[4]?.toUpperCase() ?? '';
  }

  public get jobIdDec(): number {
    return parseInt(this.jobIdHex, 16);
  }

  public get jobName(): string {
    return Util.jobEnumToJob(this.jobIdDec);
  }

  public get levelString(): string {
    return this.parts[5] ?? '';
  }

  public get level(): number {
    return parseFloat(this.levelString);
  }

  public get ownerId(): string {
    return this.parts[6]?.toUpperCase() ?? '';
  }

  public get worldId(): string {
    return this.parts[7] ?? '';
  }

  public get worldName(): string {
    return this.parts[8] ?? '';
  }

  public get npcNameId(): string {
    return this.parts[9] ?? '';
  }

  public get npcBaseId(): string {
    return this.parts[10] ?? '';
  }

  public get currentHp(): number {
    return parseFloat(this.parts[11] ?? '');
  }

  public get maxHpString(): string {
    return this.parts[14] ?? '';
  }

  public get maxHp(): number {
    return parseFloat(this.maxHpString);
  }

  public get currentMp(): number {
    return parseFloat(this.parts[13] ?? '');
  }

  public get maxMpString(): string {
    return this.parts[14] ?? '';
  }

  public get maxMp(): number {
    return parseFloat(this.maxMpString);
  }

  public get currentTp(): number {
    return parseFloat(this.parts[15] ?? '');
  }

  public get maxTp(): number {
    return parseFloat(this.parts[16] ?? '');
  }

  public get xString(): string {
    return this.parts[17] ?? '';
  }

  public get x(): number {
    return parseFloat(this.xString);
  }

  public get yString(): string {
    return this.parts[18] ?? '';
  }

  public get y(): number {
    return parseFloat(this.yString);
  }

  public get zString(): string {
    return this.parts[19] ?? '';
  }

  public get z(): number {
    return parseFloat(this.zString);
  }

  public get heading(): number {
    return parseFloat(this.parts[20] ?? '');
  }

  convert(_: LogRepository): void {
    let combatantName = this.name;
    if (this.worldName !== '')
      combatantName = combatantName + '(' + this.worldName + ')';

    this.convertedLine = this.prefix() + this.id.toUpperCase() +
      ':Added new combatant ' + combatantName +
      '.  Job: ' + this.jobName +
      ' Level: ' + this.levelString +
      ' Max HP: ' + this.maxHpString +
      ' Max MP: ' + this.maxMpString +
      ' Pos: (' + this.xString + ',' + this.yString + ',' + this.zString + ')';

    // This last part is guesswork for the area between 9 and 10.
    const unknownValue = this.npcNameId +
      EmulatorCommon.zeroPad(this.npcBaseId, 8 + Math.max(0, 6 - this.npcNameId.length));

    if (unknownValue !== '00000000000000')
      this.convertedLine += ' (' + unknownValue + ')';

    this.convertedLine += '.';
  }
}

export class LineEvent03 extends LineEvent0x03 { }
