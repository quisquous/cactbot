import { NetAllFields } from './net_fields';
import { TriggerTypes } from './net_trigger';

export type Matches = { [s in T]?: string };
export type ToMatches<F> = Record<keyof F, string>;


export type NetMatches = Matches & {
};

export type NetAllMatches = {
  [type in TriggerTypes]:
    type extends 'None' ? Matches : NetMatches & ToMatches<NetAllFields[type]>;
}

export type NetAnyMatches = NetAllMatches[keyof NetAllMatches];
