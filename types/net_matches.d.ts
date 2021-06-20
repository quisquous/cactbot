import { NetAllFields } from './net_fields';
import { TriggerTypes } from './net_trigger';

export type Matches = { [s in T]?: string };
export type ToMatches<Fields> = Record<keyof Fields, string>;

export type NetAllMatches = {
  [type in TriggerTypes]:
    type extends 'None' ? Matches : Matches & ToMatches<NetAllFields[type]>;
}

export type NetAnyMatches = NetAllMatches[keyof NetAllMatches];
