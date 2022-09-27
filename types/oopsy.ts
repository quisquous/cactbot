import { Lang } from '../resources/languages';
import { TrackedEvent } from '../ui/oopsyraidsy/player_state_tracker';

import { OopsyData } from './data';
import { NetAnyMatches, NetMatches } from './net_matches';
import { CactbotBaseRegExp, TriggerTypes } from './net_trigger';
import { LocaleText, ZoneIdType } from './trigger';

export type OopsyMistakeType =
  | 'pull'
  | 'warn'
  | 'fail'
  | 'potion'
  | 'death'
  | 'wipe'
  | 'damage'
  | 'heal'
  | 'good';

export type OopsyField =
  | boolean
  | number
  | string
  | OopsyMistake
  | OopsyMistake[]
  | OopsyDeathReason
  | void;

export type InternalOopsyTriggerType =
  | 'Buff'
  | 'Damage'
  | 'GainsEffect'
  | 'Share'
  | 'Solo';

export type DeathReportData = {
  lang: Lang;
  baseTimestamp: number | undefined;
  deathTimestamp: number;
  targetId: string;
  targetName: string;
  events: TrackedEvent[];
};

export type OopsyMistake = {
  type: OopsyMistakeType;
  name?: string;
  blame?: string;
  reportId?: string;
  text: string | LocaleText;
  // Internal annotation for which trigger type created this.
  // This will get overwritten when triggers are loaded/created.
  triggerType?: InternalOopsyTriggerType;
  // TODO: change type so this only exists for type='death'.
  report?: DeathReportData;
};

export type OopsyDeathReason = {
  id: string;
  name: string;
  text: string | LocaleText;
};

export type OopsyFunc<Data extends OopsyData, MatchType extends NetAnyMatches, Return> = (
  data: Data,
  matches: MatchType,
) => Return;

export type OopsyTriggerField<Data extends OopsyData, MatchType extends NetAnyMatches, Return> =
  [Return] extends [void] ? OopsyFunc<Data, MatchType, void>
    : OopsyFunc<Data, MatchType, Return | undefined> | Return | undefined;

export type BaseOopsyTrigger<Data extends OopsyData, Type extends TriggerTypes> = {
  id: string;
  condition?: OopsyTriggerField<Data, NetMatches[Type], boolean>;
  delaySeconds?: OopsyTriggerField<Data, NetMatches[Type], number>;
  suppressSeconds?: OopsyTriggerField<Data, NetMatches[Type], number>;
  deathReason?: OopsyTriggerField<Data, NetMatches[Type], OopsyDeathReason>;
  mistake?: OopsyTriggerField<Data, NetMatches[Type], OopsyMistake | OopsyMistake[]>;
  run?: OopsyTriggerField<Data, NetMatches[Type], void>;
};

type OopsyTriggerRegex<T extends TriggerTypes> = {
  type: T;
  netRegex: CactbotBaseRegExp<T>;
  netRegexDe?: CactbotBaseRegExp<T>;
  netRegexFr?: CactbotBaseRegExp<T>;
  netRegexJa?: CactbotBaseRegExp<T>;
  netRegexCn?: CactbotBaseRegExp<T>;
  netRegexKo?: CactbotBaseRegExp<T>;
};

export type OopsyTriggerGeneric<Data extends OopsyData, T extends TriggerTypes> =
  & BaseOopsyTrigger<Data, T>
  & OopsyTriggerRegex<T>;

export type OopsyTrigger<Data extends OopsyData> =
  | (TriggerTypes extends infer T ? T extends TriggerTypes ? OopsyTriggerGeneric<Data, T> : never
    : never)
  | {
    // Triggers that want to show up in the UI but are implemented internally.
    id: string;
  };

export type MistakeMap = { [mistakeId: string]: string };

export type SimpleOopsyTriggerSet = {
  zoneId: ZoneIdType | ZoneIdType[];
  damageWarn?: MistakeMap;
  damageFail?: MistakeMap;
  gainsEffectWarn?: MistakeMap;
  gainsEffectFail?: MistakeMap;
  shareWarn?: MistakeMap;
  shareFail?: MistakeMap;
  soloWarn?: MistakeMap;
  soloFail?: MistakeMap;
};

export type OopsyTriggerSet<Data extends OopsyData> = SimpleOopsyTriggerSet & {
  triggers?: OopsyTrigger<Data>[];
};

export type LooseOopsyTrigger = Partial<
  BaseOopsyTrigger<OopsyData, 'None'> & OopsyTriggerRegex<'None'>
>;

export type LooseOopsyTriggerSet = Exclude<Partial<OopsyTriggerSet<OopsyData>>, 'triggers'> & {
  zoneRegex?: RegExp | { [lang in Lang]?: RegExp };
  triggers?: LooseOopsyTrigger[];
};

export interface OopsyFileData {
  [filename: string]: LooseOopsyTriggerSet;
}
