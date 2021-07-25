import { EventResponses } from '../../types/event';
import { Job } from '../../types/job';
import { NetMatches } from '../../types/net_matches';

import { calcGCDFromStat } from './utils';

export type Stats = Partial<{
  [k in keyof NetMatches['PlayerStats']]: number;
} & {
  gcdSkill: number;
  gcdSpell: number;
}>;

export type SpeedBuffs = {
  presenceOfMind: number;
  shifu: number;
  huton: number;
  paeonStacks: number;
  museStacks: number;
  circleOfPower: number;
};

/** Player data */
export default class Player {
  name: string;
  level: number;
  job: Job;
  hp: number;
  maxHP: number;
  currentShield: number;
  mp: number;
  prevMP: number;
  maxMP: number;
  cp: number;
  maxCP: number;
  gp: number;
  maxGP: number;
  stats: Stats;
  speedBuffs: SpeedBuffs;

  constructor() {
    // basic info
    this.name = '';
    this.level = 0;
    this.job = 'NONE';
    this.hp = 0;
    this.maxHP = 0;
    this.currentShield = 0;
    this.mp = 0;
    this.prevMP = 0;
    this.maxMP = 0;
    this.cp = 0;
    this.maxCP = 0;
    this.gp = 0;
    this.maxGP = 0;

    // player stats
    this.stats = {};
    this.speedBuffs = {
      presenceOfMind: 0,
      shifu: 0,
      huton: 0,
      paeonStacks: 0,
      museStacks: 0,
      circleOfPower: 0,
    };
  }

  get gcdSkill(): number {
    return calcGCDFromStat(this, this.stats.skillSpeed ?? 0);
  }

  get gcdSpell(): number {
    return calcGCDFromStat(this, this.stats.spellSpeed ?? 0);
  }

  getActionCooldown(originalCd: number, type: 'skill' | 'spell'): number {
    let speed = 0;
    if (type === 'skill')
      speed = this.stats.skillSpeed ?? 0;
    else if (type === 'spell')
      speed = this.stats.spellSpeed ?? 0;
    else
      throw new Error(`Invalid type: ${type as string}`);

    return calcGCDFromStat(this, speed, originalCd);
  }

  _onPlayerChanged(e: EventResponses['onPlayerChangedEvent']): void {
    if (this.name !== e.detail.name)
      this.name = e.detail.name;

    if (this.job !== e.detail.job)
      this.job = e.detail.job;
  }
}
