import { JobDetail } from '../../types/event';
import { Job } from '../../types/job';
import { NetMatches } from '../../types/net_matches';

import { calcGCDFromStat } from './utils';

export type Stats = Omit<
  {
    [
      K in keyof NetMatches['PlayerStats'] as string extends K
        ? never
        : number extends K
        ? never
        : K
    ]: number;
  },
  'type' | 'timestamp' | 'job'
>;

export type SpeedBuffs = {
  presenceOfMind: boolean;
  shifu: boolean;
  huton: boolean;
  paeonStacks: number;
  museStacks: number;
  circleOfPower: boolean;
};

/** Player data */
export class Player {
  id: string;
  name: string;
  level: number;
  job: Job;
  hp: number;
  maxHp: number;
  shield: number;
  mp: number;
  maxMp: number;
  cp: number;
  maxCp: number;
  gp: number;
  maxGp: number;
  pos: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  stats?: Stats;
  speedBuffs: SpeedBuffs;
  jobDetail?: JobDetail[keyof JobDetail];

  constructor() {
    // basic info
    this.id = '';
    this.name = '';
    this.level = 0;
    this.job = 'NONE';
    this.hp = 0;
    this.maxHp = 0;
    this.shield = 0;
    this.mp = 0;
    this.maxMp = 0;
    this.cp = 0;
    this.maxCp = 0;
    this.gp = 0;
    this.maxGp = 0;

    this.pos = {
      x: 0,
      y: 0,
      z: 0,
    };
    this.rotation = 0;

    this.speedBuffs = {
      presenceOfMind: true,
      shifu: true,
      huton: true,
      paeonStacks: 0,
      museStacks: 0,
      circleOfPower: true,
    };
  }

  get gcdSkill(): number {
    return calcGCDFromStat(this, this.stats?.skillSpeed ?? 0);
  }

  get gcdSpell(): number {
    return calcGCDFromStat(this, this.stats?.spellSpeed ?? 0);
  }

  /** compute cooldown based on the current player's stat data */
  getActionCooldown(originalCd: number, type: 'skill' | 'spell'): number {
    let speed = 0;
    if (type === 'skill')
      speed = this.stats?.skillSpeed ?? 0;
    else if (type === 'spell')
      speed = this.stats?.spellSpeed ?? 0;
    else
      throw new Error(`Invalid type: ${type as string}`);

    return calcGCDFromStat(this, speed, originalCd);
  }
}
