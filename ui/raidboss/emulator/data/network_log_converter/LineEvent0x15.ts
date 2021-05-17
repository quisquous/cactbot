import LineEvent from './LineEvent';
import { LogRepository } from './LogRepository';

export type LineEvent0x15Parts = [
  string, // 0: ID
  string, // 1: Timestamp
  string, // 2: Source ID
  string, // 3: Source Name
  string, // 4: Ability ID
  string, // 5: Ability Name
  string, // 6: Target ID
  string, // 7: Target Name
  string, // 8: Flags
  string, // 9: Everything here and lower is complicated
  string, // 10:
  string, // 11:
  string, // 12:
  string, // 13:
  string, // 14:
  string, // 15:
  string, // 16:
  string, // 17:
  string, // 18:
  string, // 19:
  string, // 20:
  string, // 21:
  string, // 22:
  string, // 23:
  string, // 24:
  string, // 25:
  string, // 26:
  string, // 27:
  string, // 28:
  string, // 29:
  string, // 30:
  string, // 31:
  string, // 32:
  string, // 33:
  string, // 34:
  string, // 35:
  string, // 36:
  string, // 37:
  string, // 38:
  string, // 39:
  string, // 40:
  string, // 41:
  string, // 42:
  string, // 43:
  string, // 44:
  string, // 45:
  string, // 46: Checksum
];

// Ability hit single target event
export class LineEvent0x15 extends LineEvent {
  id: string;
  name: string;
  abilityId: string;
  abilityName: string;
  targetId: string;
  targetName: string;
  flags: string;
  damage: number;
  targetHp: string;
  targetMaxHp: string;
  targetMp: string;
  targetMaxMp: string;
  targetX: string;
  targetY: string;
  targetZ: string;
  targetHeading: string;
  sourceHp: string;
  sourceMaxHp: string;
  sourceMp: string;
  sourceMaxMp: string;
  x: string;
  sourceX: string;
  y: string;
  sourceY: string;
  z: string;
  sourceZ: string;
  heading: string;
  sourceHeading: string;
  constructor(repo: LogRepository, line: string, public parts: LineEvent0x15Parts) {
    super(repo, line, parts);

    this.id = parts[2].toUpperCase();
    this.name = parts[3];
    repo.updateCombatant(this.id, {
      job: undefined,
      name: this.name,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.abilityId = parts[4].toUpperCase();
    this.abilityName = parts[5];

    this.targetId = parts[6].toUpperCase();
    this.targetName = parts[7];
    repo.updateCombatant(this.targetId, {
      job: undefined,
      name: this.targetName,
      spawn: this.timestamp,
      despawn: this.timestamp,
    });

    this.flags = parts[8];

    let offset = 0;

    if (this.flags === '3F')
      offset = 2;

    this.damage = LineEvent.calculateDamage(parts[9 + offset] as string);

    this.targetHp = parts[24 + offset] as string;
    this.targetMaxHp = parts[25 + offset] as string;

    this.targetMp = parts[26 + offset] as string;
    this.targetMaxMp = parts[27 + offset] as string;

    this.targetX = parts[30 + offset] as string;
    this.targetY = parts[31 + offset] as string;
    this.targetZ = parts[32 + offset] as string;
    this.targetHeading = parts[33 + offset] as string;

    this.sourceHp = parts[34 + offset] as string;
    this.sourceMaxHp = parts[35 + offset] as string;

    this.sourceMp = parts[36 + offset] as string;
    this.sourceMaxMp = parts[37 + offset] as string;

    // Also map these to x/y/z/heading for combatant state updates
    this.x = this.sourceX = parts[40 + offset] as string;
    this.y = this.sourceY = parts[41 + offset] as string;
    this.z = this.sourceZ = parts[42 + offset] as string;
    this.heading = this.sourceHeading = parts[43 + offset] as string;
  }
}

export class LineEvent21 extends LineEvent0x15 {}
