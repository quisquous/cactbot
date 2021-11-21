import EventEmitter from 'eventemitter3';

import logDefinitions from '../../resources/netlog_defs';
import { addOverlayListener } from '../../resources/overlay_plugin_api';
import { NetMatches } from '../../types/net_matches';

import { normalizeLogLine } from './utils';

export interface EventMap {
  'action': (actionId: string, info: Partial<NetMatches['Ability']>) => void;
}

export class JobsEventEmitter extends EventEmitter<keyof EventMap> {
  constructor() {
    super();
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
    addOverlayListener('LogLine', (ev) => {
      const type = ev.line[logDefinitions.None.fields.type];
      switch (type) {
        case logDefinitions.Ability.type:
        case logDefinitions.NetworkAOEAbility.type:
          this.emit(
            'action',
            ev.line[logDefinitions.Ability.fields.id] ?? '',
            normalizeLogLine(ev.line, logDefinitions.Ability.fields)
          );
          break;

        default:
          break;
      }
    });
  }
}
