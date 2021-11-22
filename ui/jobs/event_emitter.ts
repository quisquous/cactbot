import EventEmitter from 'eventemitter3';
import { isEqual } from 'lodash';

import logDefinitions from '../../resources/netlog_defs';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import { EventResponses as OverlayEventResponses, JobDetail, PlayerChangedJobDetails } from '../../types/event';
import { Job } from '../../types/job';
import { NetMatches } from '../../types/net_matches';

import { Player } from './player';
import { normalizeLogLine } from './utils';

export interface EventMap {
  // triggered when data of current player is updated
  'player/hp': (info: { hp: number; maxHp: number; prevHp: number; shield: number; prevShield: number }) => void;
  'player/mp': (info: { mp: number; maxMp: number; prevMp: number }) => void;
  'player/cp': (info: { cp: number; maxCp: number; prevCp: number }) => void;
  'player/gp': (info: { gp: number; maxGp: number; prevGp: number }) => void;
  'player/job': (job: Job) => void;
  'player/level': (level: number) => void;
  'player/pos': (pos: { x: number; y: number; z: number }, rotation: number) => void;
  'player/job-detail': <J extends Job>(job: J, jobDetail: PlayerChangedJobDetails<J>['jobDetail']) => void;
  'player': (player: Player) => void;
  // battle events
  'battle/in-combat': (info: { game: boolean; act: boolean }) => void;
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

    addOverlayListener('onInCombatChangedEvent', (ev) => {
      this.emit('battle/in-combat', {
        game: ev.detail.inGameCombat,
        act: ev.detail.inACTCombat,
      });
    });

    addOverlayListener('LogLine', (ev) => {
      this.processLogLine(ev);
    });
  }

  private processLogLine(ev: OverlayEventResponses['LogLine']): void {
    const type = ev.line[logDefinitions.None.fields.type];

    switch (type) {
      case logDefinitions.Ability.type:
      case logDefinitions.NetworkAOEAbility.type: {
        const source = ev.line[logDefinitions.Ability.fields.source];
        if (source === this.player.id) {
          this.emit(
            'action/you',
            ev.line[logDefinitions.Ability.fields.id] ?? '',
            normalizeLogLine(ev.line, logDefinitions.Ability.fields)
          );
        }
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
      this.emit('player/level', data.level);
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
}
