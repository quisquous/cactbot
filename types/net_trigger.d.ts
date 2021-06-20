import { NetAllFields } from './net_fields';
import { NetAllMatches } from './net_matches';

export class CactbotRegExpExecArray<T extends TriggerTypes> extends RegExpExecArray {
  groups?: NetAllMatches[T];
}

export class CactbotBaseRegExp<T extends TriggerTypes> extends RegExp {
  exec(string: string): CactbotRegExpExecArray<T> | null;
}

export type TriggerTypes = keyof NetAllFields;
