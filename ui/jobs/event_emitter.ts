import EventEmitter from 'eventemitter3';
import { isEqual } from 'lodash';

import logDefinitions from '../../resources/netlog_defs';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import ZoneInfo from '../../resources/zone_info';
import { EventResponses as OverlayEventResponses, JobDetail } from '../../types/event';
import { Job } from '../../types/job';
import { NetFields } from '../../types/net_fields';
import { ToMatches } from '../../types/net_matches';

import ComboTracker from './combo_tracker';
import { Player, Stats } from './player';
import { normalizeLogLine } from './utils';

export interface EventMap {
  // triggered when data of current player is updated
  'player/hp': (info: { hp: number; maxHp: number; prevHp: number; shield: number; prevShield: number }) => void;
  'player/mp': (info: { mp: number; maxMp: number; prevMp: number }) => void;
  'player/cp': (info: { cp: number; maxCp: number; prevCp: number }) => void;
  'player/gp': (info: { gp: number; maxGp: number; prevGp: number }) => void;
  'player/job': (job: Job) => void;
  'player/level': (level: number, prevLevel: number) => void;
  'player/pos': (pos: { x: number; y: number; z: number }, rotation: number) => void;
  'player/job-detail': <JobKey extends Job>(job: JobKey, jobDetail: JobKey extends keyof JobDetail ? JobDetail[JobKey] : never) => void;
  'player/stat': (stat: Stats, gcd: { gcdSkill: number; gcdSpell: number }) => void;
  'player': (player: Player) => void;
  // zone changing
  'zone/change': (id: number, name: string, info?: typeof ZoneInfo[number]) => void;
  // battle events
  'battle/in-combat': (info: { game: boolean; act: boolean }) => void;
  'battle/wipe': () => void;
  'battle/target': (target?: { name: string; distance: number; effectiveDistance: number }) => void;
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
  // triggered when dot or hot tick
  'tick/dot': (damage: number, info: Partial<ToMatches<NetFields['NetworkDoT']>>) => void;
  'tick/hot': (heal: number, info: Partial<ToMatches<NetFields['NetworkDoT']>>) => void;
}

export class JobsEventEmitter extends EventEmitter<keyof EventMap> {
  public combo: ComboTracker;
  public player: Player;

  constructor() {
    super();

    this.player = new Player();

    // setup combo tracker
    this.combo = ComboTracker.setup((id) => {
      this.emit('action/combo', id, this.combo);
    });
    this.on('action/you', (actionId) => {
      this.combo.HandleAbility(actionId);
    });
    this.on('player/hp', ({ hp }) => {
      if (hp === 0)
        this.combo.AbortCombo();
    });
    // Combos are job specific.
    this.on('player/job', () => this.combo.AbortCombo());
  }

  override on<Key extends keyof EventMap>(event: Key, listener: EventMap[Key]): this {
    return super.on(event, listener);
  }

  override once<Key extends keyof EventMap>(event: Key, listener: EventMap[Key]): this {
    return super.once(event, listener);
  }

  override emit<Key extends keyof EventMap>(
    event: Key, ...args: Parameters<EventMap[Key]>
  ): boolean {
    return super.emit(event, ...args);
  }

  override off<Key extends keyof EventMap>(event: Key, listener: EventMap[Key]): this {
    return super.off(event, listener);
  }

  registerOverlayListeners(): void {
    addOverlayListener('onPlayerChangedEvent', (ev) => {
      this.processPlayerChangedEvent(ev);
    });

    addOverlayListener('EnmityTargetData', (ev) => {
      this.processEnmityTargetData(ev);
    });

    addOverlayListener('onPartyWipe', () => {
      this.emit('battle/wipe');
    });

    addOverlayListener('onInCombatChangedEvent', (ev) => {
      this.emit('battle/in-combat', {
        game: ev.detail.inGameCombat,
        act: ev.detail.inACTCombat,
      });
    });

    addOverlayListener('ChangeZone', (ev) => {
      this.emit('zone/change', ev.zoneID, ev.zoneName, ZoneInfo[ev.zoneID]);
    });

    addOverlayListener('LogLine', (ev) => {
      this.processLogLine(ev);
    });
  }

  private processLogLine(ev: OverlayEventResponses['LogLine']): void {
    const type = ev.line[logDefinitions.None.fields.type];

    switch (type) {
      case logDefinitions.PlayerStats.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.PlayerStats.fields);
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
        this.player.stats = stat;
        this.emit('player/stat', stat, this.player);
        break;
      }
      case logDefinitions.GainsEffect.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.GainsEffect.fields);
        const effectId = matches.effectId;
        if (!effectId)
          break;

        if (parseInt(matches.sourceId ?? '0', 16) === this.player.id)
          this.emit('effect/gain/you', effectId, matches);
        this.emit('effect/gain', effectId, matches);
        break;
      }
      case logDefinitions.LosesEffect.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.LosesEffect.fields);
        const effectId = matches.effectId;
        if (!effectId)
          break;

        if (parseInt(matches.sourceId ?? '0', 16) === this.player.id)
          this.emit('effect/lose/you', effectId, matches);
        this.emit('effect/lose', effectId, matches);
        break;
      }
      case logDefinitions.Ability.type:
      case logDefinitions.NetworkAOEAbility.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.Ability.fields);
        const sourceId = matches.sourceId;
        const id = matches.id;
        if (!id)
          break;

        if (sourceId && parseInt(sourceId, 16) === this.player.id)
          this.emit('action/you', id, matches);
        break;
      }

      case logDefinitions.NetworkDoT.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.NetworkDoT.fields);
        const damage = parseInt(matches.damage ?? '0', 16); // damage is in hex
        if (matches.which === 'DoT')
          this.emit('tick/dot', damage, matches);
        else if (matches.which === 'HoT')
          this.emit('tick/hot', damage, matches);
        break;
      }

      default:
        break;
    }
  }

  private processPlayerChangedEvent({ detail: data }: OverlayEventResponses['onPlayerChangedEvent']): void {
    this.player.id = data.id;
    this.player.name = data.name;

    // always update stuffs when player changed their jobs
    const prevJob = this.player.job;
    if (prevJob !== data.job) {
      this.player.job = data.job;
      this.emit('player/job', data.job);
    }

    // update level
    if (this.player.level !== data.level) {
      const prevLevel = this.player.level;
      this.player.level = data.level;
      this.emit('player/level', data.level, prevLevel);
    }

    // update hp
    if (
      prevJob !== data.job ||
      this.player.hp !== data.currentHP ||
      this.player.maxHp !== data.maxHP ||
      this.player.shield !== data.currentShield
    ) {
      const prevHp = this.player.hp;
      const prevShield = this.player.shield;
      this.player.hp = data.currentHP;
      this.player.maxHp = data.maxHP;
      this.player.shield = data.currentShield;
      this.emit('player/hp', {
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
      this.player.mp !== data.currentMP ||
      this.player.maxMp !== data.maxMP
    ) {
      const prevMp = this.player.mp;
      this.player.mp = data.currentMP;
      this.player.maxMp = data.maxMP;
      this.emit('player/mp', {
        mp: data.currentMP,
        maxMp: data.maxMP,
        prevMp: prevMp,
      });
    }

    // update cp
    if (
      prevJob !== data.job ||
      this.player.cp !== data.currentCP ||
      this.player.maxCp !== data.maxCP
    ) {
      const prevCp = this.player.cp;
      this.player.cp = data.currentCP;
      this.player.maxCp = data.maxCP;
      this.emit('player/cp', {
        cp: data.currentCP,
        maxCp: data.maxCP,
        prevCp: prevCp,
      });
    }

    // update gp
    if (
      prevJob !== data.job ||
      this.player.gp !== data.currentGP ||
      this.player.maxGp !== data.maxGP
    ) {
      const prevGp = this.player.gp;
      this.player.gp = data.currentGP;
      this.player.maxGp = data.maxGP;
      this.emit('player/gp', {
        gp: data.currentGP,
        maxGp: data.maxGP,
        prevGp: prevGp,
      });
    }

    if (
      this.player.pos.x !== data.pos.x ||
      this.player.pos.y !== data.pos.y ||
      this.player.pos.z !== data.pos.z ||
      this.player.rotation !== data.rotation
    ) {
      this.player.pos = data.pos;
      this.player.rotation = data.rotation;
      this.emit('player/pos', data.pos, data.rotation);
    }

    // update job details if there are
    if (data.jobDetail && !isEqual(this.player.jobDetail, data.jobDetail)) {
      this.player.jobDetail = data.jobDetail;
      this.emit('player/job-detail', data.job, data.jobDetail);
    }

    this.emit('player', this.player);
  }

  processEnmityTargetData({ Target: target }: OverlayEventResponses['EnmityTargetData']): void {
    if (target) {
      this.emit('battle/target', {
        name: target.Name,
        distance: target.Distance,
        effectiveDistance: target.EffectiveDistance,
      });
    } else {
      this.emit('battle/target');
    }
  }
}


/**
 * Track DoTs that was applied to mobs.
 *
 * Emit events when DoT ticks on your main target.
 *
 * The mechanism of this tracker is to find out the target that player
 * has applied DoT to and attacked with some actions.
 * (Which we call it the "last attacked DoTed target", is the boss in most cases.)
 * For a Bard, if there are a boss and some adds, the Bard would likely
 * keep the DoT on the boss while attacking the adds without any DoT.
 *
 * @example
 *
 * const tracker = new DoTTracker(jobsEventEmitter);
 * tracker.onTick([EffectId.Stormbite, EffectId.CausticBite], (targetId) => {
 *   // do something like update repertoire timer.
 * });
 */
 export class DotTracker extends EventEmitter {
  ee: JobsEventEmitter;
  trackedDoTs: string[];

  targets: string[];
  lastAttackedTarget?: string;

  constructor(jobsEventEmitter: JobsEventEmitter) {
    super();

    this.ee = jobsEventEmitter;
    this.trackedDoTs = [];

    this.targets = [];

    this.registerListeners();
  }

  private registerListeners(): void {
    this.ee.on('effect/gain', (id, { sourceId, targetId }) => {
      if (
        targetId?.startsWith('4') &&
        parseInt(sourceId ?? '0') === this.ee.player.id &&
        this.trackedDoTs.includes(id)
      )
        this.targets.push(targetId);
    });

    this.ee.on('effect/lose', (id, { sourceId, targetId }) => {
      if (
        targetId?.startsWith('4') &&
        parseInt(sourceId ?? '0') === this.ee.player.id &&
        this.trackedDoTs.includes(id)
      )
        this.targets.splice(this.targets.indexOf(targetId), 1);
    });

    this.ee.on('action/you', (id, { targetId }) => {
      if (targetId?.startsWith('4') && this.trackedDoTs.includes(id))
        this.lastAttackedTarget = targetId;
    });

    this.ee.on('tick/dot', (_damage, { id, effectId }) => {
      if (
        id &&
        this.lastAttackedTarget === id &&
        this.targets.includes(id) &&
        // if effectId is not 0, that means this DoT tick is produced
        // by a "damage field" skill (e.g. Ninja's "Doton" or Dark Knight's "Salted Earth")
        // which is not a literal DoT.
        effectId === '0'
      )
        this.emit('tick', id);
    });

    // reset on job change or zone change or out of combat
    this.ee.on('player/job', () => this.reset());
    this.ee.on('zone/change', () => this.reset());
    this.ee.on('battle/in-combat', ({ game }) => {
      if (game === false)
        this.reset();
    });
  }

  onTick(trackedDoTs: string[], cb: (targetId?: string) => void): void {
    this.trackedDoTs = trackedDoTs;
    this.removeAllListeners();
    this.on('tick', cb);
  }

  reset(): void {
    this.targets = [];
    this.lastAttackedTarget = undefined;
  }
}

export const jobsEventEmitter = new JobsEventEmitter();
