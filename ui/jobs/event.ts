import isDeepEqual from 'lodash/isEqual';

import { EventEmitter } from '../../resources/eventemitter';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import { JobDetail, Party, PlayerChangedRet } from '../../types/event';
import { Job } from '../../types/job';

import Player from './player';

export interface JobsEventMap {
  'zone/change': (id: number, name: string) => void;
  'party/change': (party: Party[]) => void;
  'party/wipe': () => void;
  'player': (player: PlayerChangedRet) => void;
  'player/job': (job: string, jobId?: number) => void;
  'player/level': (level: number, prevLevel?: number) => void;
  'player/hp': (hp: number, maxHp: number, prevHp?: number) => void;
  'player/mp': (mp: number, maxMp: number, prevMp?: number) => void;
  'player/cp': (cp: number, maxCp: number, prevCp?: number) => void;
  'player/gp': (gp: number, maxGp: number, prevGp?: number) => void;
  'player/shield': (shield: number, prevShield?: number) => void;
  'player/position': (pos: { x: number; y: number; z: number; rotation: number }) => void;
  'player/jobDetail': (jobDetail: JobDetail[keyof JobDetail], job?: Job, jobId?: number) => void;
  'fisher/bait': (baitId: number) => void;
}

export type JobsEvent = keyof JobsEventMap;

export class JobsEventEmitter extends EventEmitter {
  player: Player;

  constructor() {
    super();

    this.player = new Player();

    addOverlayListener('ChangeZone', (ev) => {
      this.emit('zone/change', ev.zoneID, ev.zoneName);
    });

    addOverlayListener('PartyChanged', (ev) => {
      this.emit('party/change', ev.party);
    });

    addOverlayListener('onPartyWipe', () => {
      this.emit('party/wipe');
    });

    addOverlayListener('onPlayerChangedEvent', (ev) => {
      this.emitPlayerData(ev.detail);
    });
  }

  override on<E extends JobsEvent>(type: E, listener: JobsEventMap[E]): JobsEventEmitter {
    super.on(type, listener);
    return this;
  }

  override once<E extends JobsEvent>(type: E, listener: JobsEventMap[E]): JobsEventEmitter {
    super.once(type, listener);
    return this;
  }

  override off<E extends JobsEvent>(type: E, listener: JobsEventMap[E]): JobsEventEmitter {
    super.off(type, listener);
    return this;
  }

  override emit<E extends JobsEvent>(type: E, ...args: Parameters<JobsEventMap[E]>): boolean {
    return super.emit(type, ...args);
  }

  private emitPlayerData(data: PlayerChangedRet) {
    this.emit('player', data);

    this.player.name = data.name;

    if (data.job !== this.player.job) {
      this.emit('player/job', data.job);
      this.player.job = data.job;
    }

    if (data.level !== this.player.level) {
      this.emit('player/level', data.level, this.player.level);
      this.player.level = data.level;
    }

    if (data.currentHP !== this.player.hp) {
      this.emit('player/hp', data.currentHP, data.maxHP, this.player.hp);
      this.player.hp = data.currentHP;
    }

    if (data.currentMP !== this.player.mp) {
      this.emit('player/mp', data.currentMP, data.maxMP, this.player.mp);
      this.player.mp = data.currentMP;
    }

    if (data.currentCP !== this.player.cp) {
      this.emit('player/cp', data.currentCP, data.maxCP, this.player.cp);
      this.player.cp = data.currentCP;
    }

    if (data.currentGP !== this.player.gp) {
      this.emit('player/gp', data.currentGP, data.maxGP, this.player.gp);
      this.player.gp = data.currentGP;
    }

    if (data.currentShield !== this.player.shield) {
      this.emit('player/shield', data.currentShield, this.player.shield);
      this.player.shield = data.currentShield;
    }

    if (
      data.pos.x !== this.player.pos.x ||
      data.pos.y !== this.player.pos.y ||
      data.pos.z !== this.player.pos.z ||
      data.rotation !== this.player.pos.rotation
    ) {
      this.emit('player/position', {
        ...data.pos,
        rotation: data.rotation,
      });
      this.player.pos.x = data.pos.x;
      this.player.pos.y = data.pos.y;
      this.player.pos.z = data.pos.z;
      this.player.pos.rotation = data.rotation;
    }

    if (data.jobDetail && !isDeepEqual(this.player.jobDetail, data.jobDetail)) {
      const jobDetail = data.jobDetail as JobDetail[keyof JobDetail];
      this.emit('player/jobDetail', jobDetail, data.job);
      this.player.jobDetail = jobDetail;
    }

    if (data.bait)
      this.emit('fisher/bait', data.bait);
  }
}
