import { NetFields } from './net_fields';
import { TriggerTypes } from './net_trigger';

export type Matches = { [s in T]?: string };
export type ToMatches<Fields> = Record<keyof Fields, string>;

export type NetMatches = {
  [type in TriggerTypes]:
    type extends 'None' ? Matches : Matches & ToMatches<NetFields[type]>;
}

export type NetAnyMatches = NetMatches[keyof NetMatches];
