import EventEmitter from 'eventemitter3';

import logDefinitions from '../../resources/netlog_defs';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import { EventResponses as OverlayEventResponses } from '../../types/event';
import { NetMatches } from '../../types/net_matches';

import { Player } from './player';
import { normalizeLogLine } from './utils';

export interface EventMap {
  // triggered when data of current player is updated
  'player/hp': (info: { hp: number; maxHp: number; prevHp?: number; shield: number; prevShield?: number }) => void;
  // triggered when casts actions
  'action/you': (actionId: string, info: Partial<NetMatches['Ability']>) => void;
  'action/party': (actionId: string, info: Partial<NetMatches['Ability']>) => void;
  'action/other': (actionId: string, info: Partial<NetMatches['Ability']>) => void;
}

export class JobsEventEmitter extends EventEmitter<keyof EventMap> {
  protected player: Player;
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

    // update hp
    if (
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
  }
}
