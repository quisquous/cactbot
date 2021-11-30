import logDefinitions from '../../../../../resources/netlog_defs';

import LineEvent, { LineEventAbility, LineEventSource, LineEventTarget } from './LineEvent';
import LogRepository from './LogRepository';

const fields = logDefinitions.StartsUsing.fields;

// Shorten a few types so dprint doesn't complain when the line gets too long.
type LESource = LineEventSource;
type LETarget = LineEventTarget;
type LEAbility = LineEventAbility;

// Ability use event
export class LineEvent0x14 extends LineEvent implements LESource, LETarget, LEAbility {
  public readonly id: string;
  public readonly name: string;
  public readonly abilityId: number;
  public readonly abilityIdHex: string;
  public readonly abilityName: string;
  public readonly targetId: string;
  public readonly targetName: string;
  public readonly duration: string;
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;
  public readonly heading: number;
  public readonly isSource = true;
  public readonly isTarget = true;
  public readonly isAbility = true;

  constructor(repo: LogRepository, line: string, parts: string[]) {
    super(repo, line, parts);

    this.id = parts[fields.sourceId]?.toUpperCase() ?? '';
    this.name = parts[fields.source] ?? '';
    this.abilityIdHex = parts[fields.id]?.toUpperCase() ?? '';
    this.abilityId = parseInt(this.abilityIdHex);
    this.abilityName = parts[fields.ability] ?? '';
    this.targetId = parts[fields.targetId]?.toUpperCase() ?? '';
    this.targetName = parts[fields.target] ?? '';
    this.duration = parts[fields.castTime] ?? '';
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

    repo.updateCombatant(this.targetId, {
      job: undefined,
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });
  }
}

export class LineEvent20 extends LineEvent0x14 {}
