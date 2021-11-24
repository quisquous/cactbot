import EventEmitter from 'eventemitter3';
import { isEqual } from 'lodash';

import logDefinitions from '../../resources/netlog_defs';
import { EventResponses as OverlayEventResponses, JobDetail } from '../../types/event';
import { Job } from '../../types/job';
import { NetFields } from '../../types/net_fields';
import { NetMatches, ToMatches } from '../../types/net_matches';

import ComboTracker from './combo_tracker';
import { JobsEventEmitter } from './event_emitter';
import { calcGCDFromStat, normalizeLogLine } from './utils';

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

export type GainCallback = (id: string, matches: Partial<ToMatches<NetFields['GainsEffect']>>) => void;
export type LoseCallback = (id: string, matches: Partial<ToMatches<NetFields['LosesEffect']>>) => void;
export type AbilityCallback = (id: string, matches: Partial<ToMatches<NetFields['Ability']>>) => void;

export interface EventMap {
  // triggered when data of current player is updated
  'hp': (
    info: { hp: number; maxHp: number; prevHp: number; shield: number; prevShield: number },
  ) => void;
  'mp': (info: { mp: number; maxMp: number; prevMp: number }) => void;
  'cp': (info: { cp: number; maxCp: number; prevCp: number }) => void;
  'gp': (info: { gp: number; maxGp: number; prevGp: number }) => void;
  'job': (job: Job) => void;
  'level': (level: number, prevLevel: number) => void;
  'pos': (pos: { x: number; y: number; z: number }, rotation: number) => void;
  'job-detail': <JobKey extends Job>(
    job: JobKey,
    jobDetail: JobKey extends keyof JobDetail ? JobDetail[JobKey] : never,
  ) => void;
  'stat': (stat: Stats, gcd: { gcdSkill: number; gcdSpell: number }) => void;
  'player': (player: Player) => void;

  // triggered when casts actions
  'action/you': (actionId: string, info: Partial<ToMatches<NetFields['Ability']>>) => void;
  'action/party': (actionId: string, info: Partial<ToMatches<NetFields['Ability']>>) => void;
  'action/other': (actionId: string, info: Partial<ToMatches<NetFields['Ability']>>) => void;
  // triggered when combo state changes
  'action/combo': (actionId: string | undefined, combo: ComboTracker) => void;
  // triggered when effect gains or loses
  'effect/gain': (effectId: string, info: Partial<ToMatches<NetFields['GainsEffect']>>) => void;
  'effect/lose': (effectId: string, info: Partial<ToMatches<NetFields['LosesEffect']>>) => void;
  'effect/gain/you': (effectId: string, info: Partial<ToMatches<NetFields['GainsEffect']>>) => void;
  'effect/lose/you': (effectId: string, info: Partial<ToMatches<NetFields['LosesEffect']>>) => void;
}

/** Player data */
export class PlayerBase {
  id: number;
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
    this.id = 0;
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
export class Player extends PlayerBase {
  ee: EventEmitter;
  jobsEmitter: JobsEventEmitter;
  // TODO: should make combo tracker as event emitter too?
  combo: ComboTracker;

  constructor(jobsEmitter: JobsEventEmitter) {
    super();
    this.ee = new EventEmitter();
    this.jobsEmitter = jobsEmitter;

    // setup combo tracker
    this.combo = ComboTracker.setup((id) => {
      this.emit('action/combo', id, this.combo);
    });
    this.on('action/you', (actionId) => {
      this.combo.HandleAbility(actionId);
    });
    this.on('hp', ({ hp }) => {
      if (hp === 0)
        this.combo.AbortCombo();
    });
    // Combos are job specific.
    this.on('job', () => this.combo.AbortCombo());

    // setup event emitter
    this.jobsEmitter.on('player', (ev) => this.processPlayerChangedEvent(ev));
    this.jobsEmitter.on('log', (line) => this.processLogLines(line));
  }

  onCombo(callback: (id: string | undefined, combo: ComboTracker) => void): void {
    const wrapper = (id: string | undefined, combo: ComboTracker) => {
      callback(id, combo);
    };
    this.on('action/combo', wrapper);
    this.once('job', () => this.off('action/combo', wrapper));
  }

  onMobGainsEffectFromYou(callback: GainCallback): void {
    const wrapper = (id: string, matches: Partial<ToMatches<NetFields['GainsEffect']>>) => {
      if (
        // check if target is a mob, whose id starts with "4"
        matches.targetId?.startsWith('4') &&
        parseInt(matches.sourceId ?? '0', 16) === this.id
      )
        callback(id, matches);
    };
    this.on('effect/gain', wrapper);
    this.once('job', () => this.off('effect/gain', wrapper));
  }

  onMobLosesEffectFromYou(callback: LoseCallback): void {
    const wrapper = (id: string, matches: Partial<ToMatches<NetFields['LosesEffect']>>) => {
      if (
        // check if target is a mob, whose id starts with "4"
        matches.targetId?.startsWith('4') &&
        parseInt(matches.sourceId ?? '0', 16) === this.id
      )
        callback(id, matches);
    };
    this.on('effect/lose', wrapper);
    this.once('job', () => this.off('effect/lose', wrapper));
  }

  onYouGainEffect(callback: GainCallback): void {
    const wrapper = (id: string, matches: Partial<ToMatches<NetFields['GainsEffect']>>) => {
      callback(id, matches);
    };
    this.on('effect/gain/you', wrapper);
    this.once('job', () => this.off('effect/gain/you', wrapper));
  }

  onYouLoseEffect(callback: LoseCallback): void {
    const wrapper = (id: string, matches: Partial<ToMatches<NetFields['LosesEffect']>>) => {
      callback(id, matches);
    };
    this.on('effect/lose/you', wrapper);
    this.once('job', () => this.off('effect/lose/you', wrapper));
  }

  onStatChange(job: string, callback: (gcd: { gcdSkill: number; gcdSpell: number }) => void): void {
    const wrapper = (_stat: Stats, gcd: Parameters<typeof callback>[0]) => {
      if (this.job === job)
        callback(gcd);
    };
    this.on('stat', wrapper);
    // unregister when player change their job
    this.once('job', () => this.off('stat', wrapper));
  }

  onUseAbility(callback: AbilityCallback): void {
    const wrapper = (id: string, matches: Partial<ToMatches<NetFields['Ability']>>) => {
      callback(id, matches);
    };
    this.on('action/you', wrapper);
    this.once('job', () => this.off('action/you', wrapper));
  }

  onJobDetailUpdate<JobKey extends keyof JobDetail>(
    job: JobKey,
    callback: (e: JobDetail[JobKey]) => void,
  ): void {
    const wrapper = <JobKey extends Job>(
      _job: JobKey,
      jobDetail: JobKey extends keyof JobDetail ? JobDetail[JobKey] : never,
    ): void => {
      // This prevents having separate onXXXJobDetailUpdate function which take explicit callbacks
      // so that the lookup into jobFuncs can be statically typed.  Honestly, JobDetail is already
      // obnoxious enough to use in TypeScript that we probably need to rethink how it is delivered.
      (callback as (detail: unknown) => void)(jobDetail);
    };
    this.on('job-detail', wrapper);
    this.once('job', (newJob) => {
      if (job !== newJob)
        this.off('job-detail', wrapper);
    });
  }

  private processPlayerChangedEvent(
    { detail: data }: OverlayEventResponses['onPlayerChangedEvent'],
  ): void {
    this.id = data.id;
    this.name = data.name;

    // always update stuffs when player changed their jobs
    const prevJob = this.job;
    if (prevJob !== data.job) {
      this.job = data.job;
      this.emit('job', data.job);
    }

    // update level
    if (this.level !== data.level) {
      const prevLevel = this.level;
      this.level = data.level;
      this.emit('level', data.level, prevLevel);
    }

    // update hp
    if (
      prevJob !== data.job ||
      this.hp !== data.currentHP ||
      this.maxHp !== data.maxHP ||
      this.shield !== data.currentShield
    ) {
      const prevHp = this.hp;
      const prevShield = this.shield;
      this.hp = data.currentHP;
      this.maxHp = data.maxHP;
      this.shield = data.currentShield;
      this.emit('hp', {
        hp: data.currentHP,
        maxHp: data.maxHP,
        prevHp: prevHp,
        shield: data.currentShield,
        prevShield: prevShield,
      });
    }

    // update mp
    if (
      prevJob !== data.job ||
      this.mp !== data.currentMP ||
      this.maxMp !== data.maxMP
    ) {
      const prevMp = this.mp;
      this.mp = data.currentMP;
      this.maxMp = data.maxMP;
      this.emit('mp', {
        mp: data.currentMP,
        maxMp: data.maxMP,
        prevMp: prevMp,
      });
    }

    // update cp
    if (
      prevJob !== data.job ||
      this.cp !== data.currentCP ||
      this.maxCp !== data.maxCP
    ) {
      const prevCp = this.cp;
      this.cp = data.currentCP;
      this.maxCp = data.maxCP;
      this.emit('cp', {
        cp: data.currentCP,
        maxCp: data.maxCP,
        prevCp: prevCp,
      });
    }

    // update gp
    if (
      prevJob !== data.job ||
      this.gp !== data.currentGP ||
      this.maxGp !== data.maxGP
    ) {
      const prevGp = this.gp;
      this.gp = data.currentGP;
      this.maxGp = data.maxGP;
      this.emit('gp', {
        gp: data.currentGP,
        maxGp: data.maxGP,
        prevGp: prevGp,
      });
    }

    if (
      this.pos.x !== data.pos.x ||
      this.pos.y !== data.pos.y ||
      this.pos.z !== data.pos.z ||
      this.rotation !== data.rotation
    ) {
      this.pos = data.pos;
      this.rotation = data.rotation;
      this.emit('pos', data.pos, data.rotation);
    }

    // update job details if there are
    if (data.jobDetail && !isEqual(this.jobDetail, data.jobDetail)) {
      this.jobDetail = data.jobDetail;
      this.emit('job-detail', data.job, data.jobDetail);
    }

    this.emit('player', this);
  }

  private processPlayerStatsLogLine(line: string[]): void {
    const matches = normalizeLogLine(line, logDefinitions.PlayerStats.fields);
    // const stat = Object
    //   .keys(matches)
    //   // drop type and timestamp and job
    //   .filter((key) => !['type', 'timestamp', 'job'].includes(key))
    //   .reduce<Stats>((acc, key) => {
    //     acc[key] = Number(matches[key] ?? 0);
    //     return acc;
    //   }, {} as Stats);
    const stat = {
      attackMagicPotency: parseInt(matches.attackMagicPotency ?? '0', 10),
      attackPower: parseInt(matches.attackPower ?? '0', 10),
      criticalHit: parseInt(matches.criticalHit ?? '0', 10),
      determination: parseInt(matches.determination ?? '0', 10),
      dexterity: parseInt(matches.dexterity ?? '0', 10),
      directHit: parseInt(matches.directHit ?? '0', 10),
      healMagicPotency: parseInt(matches.healMagicPotency ?? '0', 10),
      intelligence: parseInt(matches.intelligence ?? '0', 10),
      mind: parseInt(matches.mind ?? '0', 10),
      piety: parseInt(matches.piety ?? '0', 10),
      skillSpeed: parseInt(matches.skillSpeed ?? '0', 10),
      spellSpeed: parseInt(matches.spellSpeed ?? '0', 10),
      strength: parseInt(matches.strength ?? '0', 10),
      tenacity: parseInt(matches.tenacity ?? '0', 10),
      vitality: parseInt(matches.vitality ?? '0', 10),
    };
    this.stats = stat;
    this.emit('stat', stat, this);
  }

  private processLogLines(line: string[]): void {
    const type = line[logDefinitions.None.fields.type];
    switch (type) {
      case logDefinitions.PlayerStats.type: {
        this.processPlayerStatsLogLine(line);
        break;
      }
      case logDefinitions.GainsEffect.type: {
        const matches = normalizeLogLine(line, logDefinitions.GainsEffect.fields);
        const effectId = matches.effectId?.toUpperCase();
        if (!effectId)
          break;

        if (parseInt(matches.sourceId ?? '0', 16) === this.id)
          this.emit('effect/gain/you', effectId, matches);
        this.emit('effect/gain', effectId, matches);
        break;
      }
      case logDefinitions.LosesEffect.type: {
        const matches = normalizeLogLine(line, logDefinitions.LosesEffect.fields);
        const effectId = matches.effectId?.toUpperCase();
        if (!effectId)
          break;

        if (parseInt(matches.sourceId ?? '0', 16) === this.id)
          this.emit('effect/lose/you', effectId, matches);
        this.emit('effect/lose', effectId, matches);
        break;
      }
      case logDefinitions.Ability.type:
      case logDefinitions.NetworkAOEAbility.type: {
        const matches = normalizeLogLine(line, logDefinitions.Ability.fields);
        const sourceId = matches.sourceId;
        const id = matches.id;
        if (!id)
          break;

        if (sourceId && parseInt(sourceId, 16) === this.id)
          this.emit('action/you', id, matches);
        break;
      }
    }
  }

  on<Key extends keyof EventMap>(event: Key, listener: EventMap[Key], context?: unknown): this {
    this.ee.on(event, listener, context);
    return this;
  }

  once<Key extends keyof EventMap>(event: Key, listener: EventMap[Key], context?: unknown): this {
    this.ee.once(event, listener, context);
    return this;
  }

  off<Key extends keyof EventMap>(event: Key, listener: EventMap[Key], context?: unknown): this {
    this.ee.off(event, listener, context);
    return this;
  }

  emit<Key extends keyof EventMap>(event: Key, ...args: Parameters<EventMap[Key]>): boolean {
    return this.ee.emit(event, ...args);
  }
}
