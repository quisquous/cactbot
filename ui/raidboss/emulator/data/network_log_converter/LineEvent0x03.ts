import LineEvent from './LineEvent';
import EmulatorCommon from '../../EmulatorCommon';
import Util from '../../../../../resources/util';
import LogRepository from './LogRepository';

const fields = {
  id: 2,
  name: 3,
  jobIdHex: 4,
  levelString: 5,
  ownerId: 6,
  worldId: 7,
  worldName: 8,
  npcNameId: 9,
  npcBaseId: 10,
  currentHp: 11,
  maxHpString: 14,
  currentMp: 13,
  maxMpString: 14,
  currentTp: 15,
  maxTp: 16,
  xString: 17,
  yString: 18,
  zString: 19,
  heading: 20,
} as const;

// Added combatant event
export class LineEvent0x03 extends LineEvent {
  public readonly id: string;
  public readonly name: string;
  public readonly jobIdHex: string;
  public readonly jobIdDec: number;
  public readonly jobName: string;
  public readonly levelString: string;
  public readonly level: number;
  public readonly ownerId: string;
  public readonly worldId: string;
  public readonly worldName: string;
  public readonly npcNameId: string;
  public readonly npcBaseId: string;
  public readonly currentHp: number;
  public readonly maxHpString: string;
  public readonly maxHp: number;
  public readonly currentMp: number;
  public readonly maxMpString: string;
  public readonly maxMp: number;
  public readonly currentTp: number;
  public readonly maxTp: number;
  public readonly xString: string;
  public readonly x: number;
  public readonly yString: string;
  public readonly y: number;
  public readonly zString: string;
  public readonly z: number;
  public readonly heading: number;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.jobIdHex = parts[fields.jobIdHex]?.toUpperCase() ?? '';
    this.jobIdDec = parseInt(this.jobIdHex, 16);
    this.jobName = Util.jobEnumToJob(this.jobIdDec);
    this.levelString = parts[fields.levelString] ?? '';
    this.level = parseFloat(this.levelString);
    this.ownerId = parts[fields.ownerId]?.toUpperCase() ?? '';
    this.worldId = parts[fields.worldId] ?? '';
    this.worldName = parts[fields.worldName] ?? '';
    this.npcNameId = parts[fields.npcNameId] ?? '';
    this.npcBaseId = parts[fields.npcBaseId] ?? '';
    this.currentHp = parseFloat(parts[fields.currentHp] ?? '');
    this.maxHpString = parts[fields.maxHpString] ?? '';
    this.maxHp = parseFloat(this.maxHpString);
    this.currentMp = parseFloat(parts[fields.currentMp] ?? '');
    this.maxMpString = parts[fields.maxMpString] ?? '';
    this.maxMp = parseFloat(this.maxMpString);
    this.currentTp = parseFloat(parts[fields.currentTp] ?? '');
    this.maxTp = parseFloat(parts[fields.maxTp] ?? '');
    this.xString = parts[fields.xString] ?? '';
    this.x = parseFloat(this.xString);
    this.yString = parts[fields.yString] ?? '';
    this.y = parseFloat(this.yString);
    this.zString = parts[fields.zString] ?? '';
    this.z = parseFloat(this.zString);
    this.heading = parseFloat(parts[fields.heading] ?? '');

    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: this.jobIdHex,
    });

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
