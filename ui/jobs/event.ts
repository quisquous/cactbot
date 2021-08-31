import { EventEmitter } from '../../resources/eventemitter';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import { Party, PlayerChangedRet } from '../../types/event';

import Player from './player';

export interface JobsEventMap {
  'zone/change': (id: number, name: string) => void;
  'party/change': (party: Party[]) => void;
  'party/wipe': () => void;
  player: (player: PlayerChangedRet) => void;
  'player/level': (level: number, prevLevel: number) => void;
  'player/hp': (hp: number, maxHp: number, prevHp?: number) => void;
  'player/mp': (mp: number, maxMp: number, prevMp?: number) => void;
  'player/cp': (cp: number, maxCp: number, prevCp?: number) => void;
  'player/gp': (gp: number, maxGp: number, prevGp?: number) => void;
  'player/shield': (shield: number, prevShield?: number) => void;
  'player/position': (pos: {
    x: number;
    y: number;
    z: number;
    rotation: number;
  }) => void;
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
      this.emit('player', ev.detail);

      this.player.name = ev.detail.name;

      if (ev.detail.level !== this.player.level) {
        this.emit('player/level', ev.detail.level, this.player.level);
        this.player.level = ev.detail.level;
      }

      if (ev.detail.currentHP !== this.player.hp) {
        this.emit(
          'player/hp',
          ev.detail.currentHP,
          ev.detail.maxHP,
          this.player.hp
        );
        this.player.hp = ev.detail.currentHP;
      }

      if (ev.detail.currentMP !== this.player.mp) {
        this.emit(
          'player/mp',
          ev.detail.currentMP,
          ev.detail.maxMP,
          this.player.mp
        );
        this.player.mp = ev.detail.currentMP;
      }

      if (ev.detail.currentCP !== this.player.cp) {
        this.emit(
          'player/cp',
          ev.detail.currentCP,
          ev.detail.maxCP,
          this.player.cp
        );
        this.player.cp = ev.detail.currentCP;
      }

      if (ev.detail.currentGP !== this.player.gp) {
        this.emit(
          'player/gp',
          ev.detail.currentGP,
          ev.detail.maxGP,
          this.player.gp
        );
        this.player.gp = ev.detail.currentGP;
      }

      if (ev.detail.currentShield !== this.player.shield) {
        this.emit('player/shield', ev.detail.currentShield, this.player.shield);
        this.player.shield = ev.detail.currentShield;
      }

      if (
        ev.detail.pos.x !== this.player.pos.x ||
        ev.detail.pos.y !== this.player.pos.y ||
        ev.detail.pos.z !== this.player.pos.z ||
        ev.detail.rotation !== this.player.pos.rotation
      ) {
        this.emit('player/position', {
          ...ev.detail.pos,
          rotation: ev.detail.rotation,
        });
        this.player.pos.x = ev.detail.pos.x;
        this.player.pos.y = ev.detail.pos.y;
        this.player.pos.z = ev.detail.pos.z;
        this.player.pos.rotation = ev.detail.rotation;
      }
    });
  }

  override on<E extends JobsEvent>(
    type: E,
    listener: JobsEventMap[E]
  ): JobsEventEmitter {
    super.on(type, listener);
    return this;
  }

  override once<E extends JobsEvent>(
    type: E,
    listener: JobsEventMap[E]
  ): JobsEventEmitter {
    super.once(type, listener);
    return this;
  }

  override off<E extends JobsEvent>(
    type: E,
    listener: JobsEventMap[E]
  ): JobsEventEmitter {
    super.off(type, listener);
    return this;
  }

  override emit<E extends JobsEvent>(
    type: E,
    ...args: Parameters<JobsEventMap[E]>
  ): boolean {
    return super.emit(type, ...args);
  }
}
