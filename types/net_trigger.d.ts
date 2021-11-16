import { NetFields } from './net_fields';
import { NetMatches } from './net_matches';

export interface CactbotRegExpExecArray<T extends TriggerTypes> extends RegExpExecArray {
  groups?: T extends 'None' ? { [s: string]: string } : NetMatches[T];
}

export interface CactbotBaseRegExp<T extends TriggerTypes> extends RegExp {
  exec: (string: string) => CactbotRegExpExecArray<T> | null;
}

export type TriggerTypes = keyof NetFields;
