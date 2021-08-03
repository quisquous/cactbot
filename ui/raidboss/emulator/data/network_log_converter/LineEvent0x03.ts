import logDefinitions from '../../../../../resources/netlog_defs';
import Util from '../../../../../resources/util';
import { Job } from '../../../../../types/job';
import EmulatorCommon from '../../EmulatorCommon';

import LineEvent, { LineEventJobLevel, LineEventSource } from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.AddedCombatant.fields;

// Added combatant event
export class LineEvent0x03 extends LineEvent implements LineEventSource, LineEventJobLevel {
  public readonly id: string;
  public readonly name: string;
  public readonly jobIdHex: string;
  public readonly jobId: number;
  public readonly job: Job;
  public readonly levelString: string;
  public readonly level: number;
  public readonly ownerId: string;
  public readonly worldId: string;
  public readonly worldName: string;
  public readonly npcNameId: string;
  public readonly npcBaseId: string;
  public readonly hp: number;
  public readonly maxHpString: string;
  public readonly maxHp: number;
  public readonly mp: number;
  public readonly maxMpString: string;
  public readonly maxMp: number;
  public readonly xString: string;
  public readonly x: number;
  public readonly yString: string;
  public readonly y: number;
  public readonly zString: string;
  public readonly z: number;
  public readonly heading: number;
  public readonly isSource = true;
  public readonly isJobLevel = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.id]?.toUpperCase() ?? '';
    this.name = parts[fields.name] ?? '';
    this.jobIdHex = parts[fields.job]?.toUpperCase() ?? '';
    this.jobId = parseInt(this.jobIdHex, 16);
    this.job = Util.jobEnumToJob(this.jobId);
    this.levelString = parts[fields.level] ?? '';
    this.level = parseInt(this.levelString, 16);
    this.ownerId = parts[fields.ownerId]?.toUpperCase() ?? '';
    this.worldId = parts[fields.worldId] ?? '';
    this.worldName = parts[fields.world] ?? '';
    this.npcNameId = parts[fields.npcNameId] ?? '';
    this.npcBaseId = parts[fields.npcBaseId] ?? '';
    this.hp = parseFloat(parts[fields.currentHp] ?? '');
    this.maxHpString = parts[fields.hp] ?? '';
    this.maxHp = parseFloat(this.maxHpString);
    this.mp = parseFloat(parts[fields.currentMp] ?? '');
    this.maxMpString = parts[fields.mp] ?? '';
    this.maxMp = parseFloat(this.maxMpString);
    this.xString = parts[fields.x] ?? '';
    this.x = parseFloat(this.xString);
    this.yString = parts[fields.y] ?? '';
    this.y = parseFloat(this.yString);
    this.zString = parts[fields.z] ?? '';
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
      '.  Job: ' + this.job +
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

export class LineEvent03 extends LineEvent0x03 {}
