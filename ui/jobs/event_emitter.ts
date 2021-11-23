import EventEmitter from 'eventemitter3';
import { isEqual } from 'lodash';

import logDefinitions from '../../resources/netlog_defs';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import ZoneInfo from '../../resources/zone_info';
import { EventResponses as OverlayEventResponses, JobDetail, PlayerChangedJobDetails } from '../../types/event';
import { Job } from '../../types/job';
import { NetMatches } from '../../types/net_matches';

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
  'player/job-detail': <J extends Job>(job: J, jobDetail: PlayerChangedJobDetails<J>['jobDetail']) => void;
  'player/stat': (stat: Stats, gcd: { gcdSkill: number; gcdSpell: number }) => void;
  'player': (player: Player) => void;
  // zone changing
  'zone/change': (id: number, name: string, info?: typeof ZoneInfo[number]) => void;
  // battle events
  'battle/in-combat': (info: { game: boolean; act: boolean }) => void;
  'battle/wipe': () => void;
  'battle/target': (target?: { name: string; distance: number; effectiveDistance: number }) => void;
  // triggered when casts actions
  'action/you': (actionId: string, info: Partial<NetMatches['Ability']>) => void;
  'action/party': (actionId: string, info: Partial<NetMatches['Ability']>) => void;
  'action/other': (actionId: string, info: Partial<NetMatches['Ability']>) => void;
}

export class JobsEventEmitter extends EventEmitter<keyof EventMap> {
  public player: Player;

  constructor() {
    super();

    this.player = new Player();
    // register overlay plugin listeners
    this.registerOverlayListeners();
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

  private registerOverlayListeners(): void {
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
      case logDefinitions.Ability.type:
      case logDefinitions.NetworkAOEAbility.type: {
        const matches = normalizeLogLine(ev.line, logDefinitions.Ability.fields);
        const sourceId = matches.sourceId;
        const id = matches.id;
        if (!id)
          break;

        if (sourceId === this.player.id)
          this.emit('action/you', id, matches);
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
      this.emit('player/job', data.job);
      this.player.job = data.job;
    }

    // update level
    if (this.player.level !== data.level) {
      this.emit('player/level', data.level, this.player.level);
      this.player.level = data.level;
    }

    // update hp
    if (
      prevJob !== data.job ||
      this.player.hp !== data.currentHP ||
      this.player.maxHp !== data.maxHP ||
      this.player.shield !== data.currentShield
    ) {
      this.emit('player/hp', {
        hp: data.currentHP,
        maxHp: data.maxHP,
        prevHp: this.player.hp,
        shield: data.currentShield,
        prevShield: this.player.shield,
      });
      this.player.hp = data.currentHP;
      this.player.maxHp = data.maxHP;
      this.player.shield = data.currentShield;
    }

    // update mp
    if (
      prevJob !== data.job ||
      this.player.mp !== data.currentMP ||
      this.player.maxMp !== data.maxMP
    ) {
      this.emit('player/mp', {
        mp: data.currentMP,
        maxMp: data.maxMP,
        prevMp: this.player.mp,
      });
      this.player.mp = data.currentMP;
      this.player.maxMp = data.maxMP;
    }

    // update cp
    if (
      prevJob !== data.job ||
      this.player.cp !== data.currentCP ||
      this.player.maxCp !== data.maxCP
    ) {
      this.emit('player/cp', {
        cp: data.currentCP,
        maxCp: data.maxCP,
        prevCp: this.player.cp,
      });
      this.player.cp = data.currentCP;
      this.player.maxCp = data.maxCP;
    }

    // update gp
    if (
      prevJob !== data.job ||
      this.player.gp !== data.currentGP ||
      this.player.maxGp !== data.maxGP
    ) {
      this.emit('player/gp', {
        gp: data.currentGP,
        maxGp: data.maxGP,
        prevGp: this.player.gp,
      });
      this.player.gp = data.currentGP;
      this.player.maxGp = data.maxGP;
    }

    if (
      this.player.pos.x !== data.pos.x ||
      this.player.pos.y !== data.pos.y ||
      this.player.pos.z !== data.pos.z ||
      this.player.rotation !== data.rotation
    ) {
      this.emit('player/pos', data.pos, data.rotation);
      this.player.pos = data.pos;
      this.player.rotation = data.rotation;
    }

    // update job details if there are
    if (data.jobDetail && !isEqual(this.player.jobDetail, data.jobDetail)) {
      // FIXME: no idea to make it type safe without assertions
      this.emit('player/job-detail', data.job, data.jobDetail);
      this.player.jobDetail = data.jobDetail as JobDetail[keyof JobDetail];
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
