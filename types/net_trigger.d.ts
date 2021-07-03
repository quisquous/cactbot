import { NetFields } from './net_fields';
import { NetMatches } from './net_matches';

export class CactbotRegExpExecArray<T extends TriggerTypes> extends RegExpExecArray {
  groups?: NetMatches[T];
}

export class CactbotBaseRegExp<T extends TriggerTypes> extends RegExp {
  exec(string: string): CactbotRegExpExecArray<T> | null;
}

export type TriggerTypes = keyof NetFields;
