import EventEmitter from 'eventemitter3';
import { isEqual } from 'lodash';

import logDefinitions from '../../resources/netlog_defs';
import PartyTracker from '../../resources/party';
import ZoneInfo from '../../resources/zone_info';
import { EventResponses as OverlayEventResponses, JobDetail } from '../../types/event';
import { Job } from '../../types/job';
import { NetFields } from '../../types/net_fields';

import { ComboCallback, ComboTracker } from './combo_tracker';
import { JobsEventEmitter, PartialFieldMatches } from './event_emitter';
import { calcGCDFromStat, normalizeLogLine } from './utils';

export type Stats = Omit<
  Record<keyof NetFields['PlayerStats'], number>,
  'type' | 'timestamp' | 'job' | 'localContentId'
>;

export type SpeedBuffs = {
  presenceOfMind: boolean;
  fuka: boolean;
  huton: boolean;
  paeonStacks: number;
  museStacks: number;
  circleOfPower: boolean;
};

export type GainCallback = (id: string, matches: PartialFieldMatches<'GainsEffect'>) => void;
export type LoseCallback = (id: string, matches: PartialFieldMatches<'LosesEffect'>) => void;
export type AbilityCallback = (id: string, matches: PartialFieldMatches<'AbilityFull'>) => void;
export type ZoneChangeCallback = (id: number, name: string, info?: typeof ZoneInfo[number]) => void;

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
  'action': (actionId: string, info: PartialFieldMatches<'AbilityFull'>) => void;
  'action/you': (actionId: string, info: PartialFieldMatches<'AbilityFull'>) => void;
  'action/party': (actionId: string, info: PartialFieldMatches<'AbilityFull'>) => void;
  'action/other': (actionId: string, info: PartialFieldMatches<'AbilityFull'>) => void;
  // triggered when combo state changes
  'action/combo': (actionId: string | undefined, combo: ComboTracker) => void;
  // triggered when effect gains or loses
  'effect/gain': (effectId: string, info: PartialFieldMatches<'GainsEffect'>) => void;
  'effect/lose': (effectId: string, info: PartialFieldMatches<'LosesEffect'>) => void;
  // triggered when you gain or lose a effect
  'effect/gain/you': (effectId: string, info: PartialFieldMatches<'GainsEffect'>) => void;
  'effect/lose/you': (effectId: string, info: PartialFieldMatches<'LosesEffect'>) => void;
}

/** Player data */
export class PlayerBase {
  id: number;
  /** player id in hex, upper case */
  idHex: string;
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
    this.idHex = '';
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
      fuka: true,
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
  partyTracker: PartyTracker;
  combo: ComboTracker;

  constructor(jobsEmitter: JobsEventEmitter, partyTracker: PartyTracker, private is5x: boolean) {
    super();
    this.ee = new EventEmitter();
    this.jobsEmitter = jobsEmitter;
    this.partyTracker = partyTracker;

    // setup combo tracker
    this.combo = ComboTracker.setup(this.is5x, this);

    // setup event emitter
    this.jobsEmitter.on('player', (ev) => this.processPlayerChangedEvent(ev));
    this.jobsEmitter.on('log', (line) => this.processLogLines(line));
  }

  onCombo(callback: ComboCallback): void {
    const wrapper: ComboCallback = (id, combo) => {
      callback(id, combo);
    };
    this.combo.on('combo', wrapper);
    this.once('job', () => this.combo.off('combo', wrapper));
  }

  onMobGainsEffectFromYou(callback: GainCallback): void {
    const wrapper = (id: string, matches: PartialFieldMatches<'GainsEffect'>) => {
      if (
        // check if target is a mob, whose id starts with "4"
        matches.targetId?.startsWith('4') &&
        matches.sourceId?.toUpperCase() === this.idHex
      )
        callback(id, matches);
    };
    this.on('effect/gain', wrapper);
    this.once('job', () => this.off('effect/gain', wrapper));
  }

  onMobLosesEffectFromYou(callback: LoseCallback): void {
    const wrapper = (id: string, matches: PartialFieldMatches<'LosesEffect'>) => {
      if (
        // check if target is a mob, whose id starts with "4"
        matches.targetId?.startsWith('4') &&
        matches.sourceId?.toUpperCase() === this.idHex
      )
        callback(id, matches);
    };
    this.on('effect/lose', wrapper);
    this.once('job', () => this.off('effect/lose', wrapper));
  }

  onYouGainEffect(callback: GainCallback): void {
    const wrapper = (id: string, matches: PartialFieldMatches<'GainsEffect'>) => {
      callback(id, matches);
    };
    this.on('effect/gain/you', wrapper);
    this.once('job', () => this.off('effect/gain/you', wrapper));
  }

  onYouLoseEffect(callback: LoseCallback): void {
    const wrapper = (id: string, matches: PartialFieldMatches<'LosesEffect'>) => {
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
    const wrapper = (id: string, matches: PartialFieldMatches<'AbilityFull'>) => {
      callback(id, matches);
    };
    this.on('action/you', wrapper);
    this.once('job', () => this.off('action/you', wrapper));
  }

  onZoneChange(callback: ZoneChangeCallback): void {
    const wrapper: ZoneChangeCallback = (id, name, info) => {
      callback(id, name, info);
    };
    this.ee.on('zone/change', wrapper);
    this.once('job', () => this.ee.off('zone/change', wrapper));
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
    this.idHex = data.id.toString(16).toUpperCase();
    this.name = data.name;

    // always update stuffs when player changed their jobs
    const prevJob = this.job;
    if (prevJob !== data.job) {
      this.job = data.job;
      this.emit('job', data.job);

      // Because the `PlayerStat` log line is always emitted before
      // the `onPlayerChangedEvent` event, and we have job components
      // that relies on the stat data when initializing, so we need to
      // manually emit the stat data here.
      if (this.stats)
        this.emit('stat', this.stats, { gcdSkill: this.gcdSkill, gcdSpell: this.gcdSpell });
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

        if (matches.targetId?.toUpperCase() === this.idHex)
          this.emit('effect/gain/you', effectId, matches);
        this.emit('effect/gain', effectId, matches);
        break;
      }
      case logDefinitions.LosesEffect.type: {
        const matches = normalizeLogLine(line, logDefinitions.LosesEffect.fields);
        const effectId = matches.effectId?.toUpperCase();
        if (!effectId)
          break;

        if (matches.targetId?.toUpperCase() === this.idHex)
          this.emit('effect/lose/you', effectId, matches);
        this.emit('effect/lose', effectId, matches);
        break;
      }
      case logDefinitions.AbilityFull.type:
      case logDefinitions.NetworkAOEAbility.type: {
        const matches = normalizeLogLine(line, logDefinitions.AbilityFull.fields);
        const sourceId = matches.sourceId?.toUpperCase();
        const id = matches.id;
        if (!id)
          break;

        this.emit('action', id, matches);

        if (sourceId && sourceId === this.idHex)
          this.emit('action/you', id, matches);
        else if (sourceId && this.partyTracker.inParty(matches.source ?? ''))
          this.emit('action/party', id, matches);
        else if (sourceId && sourceId.startsWith('1')) // starts with '1' is a player
          this.emit('action/other', id, matches);
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
