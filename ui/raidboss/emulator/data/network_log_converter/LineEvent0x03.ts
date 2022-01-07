import logDefinitions from '../../../../../resources/netlog_defs';
import Util from '../../../../../resources/util';
import { Job } from '../../../../../types/job';

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
  public readonly maxHp: number;
  public readonly mp: number;
  public readonly maxMp: number;
  public readonly x: number;
  public readonly y: number;
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
    this.maxHp = parseFloat(parts[fields.hp] ?? '');
    this.mp = parseFloat(parts[fields.currentMp] ?? '');
    this.maxMp = parseFloat(parts[fields.mp] ?? '');
    this.x = parseFloat(parts[fields.x] ?? '');
    this.y = parseFloat(parts[fields.y] ?? '');
    this.z = parseFloat(parts[fields.z] ?? '');
    this.heading = parseFloat(parts[fields.heading] ?? '');

    repo.updateCombatant(this.id, {
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
      job: this.jobIdHex,
    });
  }
}

export class LineEvent03 extends LineEvent0x03 {}
