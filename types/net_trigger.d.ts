import { NetFields } from './net_fields';
import { NetMatches } from './net_matches';

export type CactbotRegExpExecArray<T extends TriggerTypes> = RegExpExecArray & {
  groups?: NetMatches[T];
};

export type CactbotBaseRegExp<T extends TriggerTypes> = RegExp & {
  exec: (string: string) => CactbotRegExpExecArray<T> | null;
};

export type TriggerTypes = keyof NetFields;
