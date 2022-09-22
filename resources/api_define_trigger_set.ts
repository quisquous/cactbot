import { RaidbossData } from '../types/data';
import { TriggerSet } from '../types/trigger';

export function defineTriggerSet<InitData>(
  set:
    & TriggerSet<RaidbossData & InitData>
    & (
      Record<string, never> extends InitData ? Record<never, never>
        : { initData: () => InitData }
    ),
): TriggerSet<RaidbossData>;

export function defineTriggerSet(
  set: Omit<TriggerSet<RaidbossData>, 'initData'>,
): TriggerSet<RaidbossData>;

/* eslint-disable func-style */
export function defineTriggerSet<Data extends RaidbossData>(
  set: TriggerSet<Data>,
): TriggerSet<Data> {
  return set;
}
/* eslint-enable func-style */
