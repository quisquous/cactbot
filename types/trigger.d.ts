import { Lang, NonEnLang } from '../resources/languages';
import { NetMatches, NetAnyMatches } from '../types/net_matches';
import { TimelineReplacement, TimelineStyle } from '../ui/raidboss/timeline';

import { RaidbossData } from './data';
import { CactbotBaseRegExp, TriggerTypes } from './net_trigger';

// TargetedMatches can be used for generic functions in responses or conditions
// that use matches from any number of Regex or NetRegex functions.
export type TargetedParams = 'sourceId' | 'source' | 'targetId' | 'target';
export type TargetedMatches = NetMatches['StartsUsing'] | NetMatches['Ability'] |
    NetMatches['GainsEffect'] | NetMatches['LosesEffect'] | NetMatches['Tether'] |
    NetMatches['WasDefeated'] | NetMatches['None'];

export type FullLocaleText = Record<Lang, string>;

export type LocaleObject<T> = {
  en: T;
} & {
  [s in NonEnLang]?: T;
};

export type LocaleText = LocaleObject<string>;

export type ZoneId = number | null;

export type OutputStrings = { [outputKey: string]: LocaleText | string };

// TODO: is it awkward to have Outputs the static class and Output the unrelated type?
// This type corresponds to TriggerOutputProxy.
export type Output = {
  responseOutputStrings: OutputStrings;
} & {
  [key: string]: (params?: { [param: string]: string | number | undefined }) => string;
};

// The output of any non-response raidboss trigger function.
export type TriggerOutput<Data extends RaidbossData, MatchType extends NetAnyMatches> =
    undefined | null | LocaleText | string | number | boolean |
    ((d: Data, m: MatchType, o: Output) => TriggerOutput<Data, MatchType>);

// Used if the function doesn't need to return an en key
export type PartialTriggerOutput<Data extends RaidbossData, MatchType extends NetAnyMatches> =
    undefined | null | Partial<LocaleText> | string | number | boolean |
    ((d: Data, m: MatchType, o: Output) => PartialTriggerOutput<Data, MatchType>);

// The type of a non-response trigger field.
export type TriggerFunc<Data extends RaidbossData, MatchType extends NetAnyMatches, Return> =
    (data: Data, matches: MatchType, output: Output) => Return;

// The output from a response function (different from other TriggerOutput functions).
export type ResponseOutput<Data extends RaidbossData, MatchType extends NetAnyMatches> = {
  infoText?: TriggerField<Data, MatchType, TriggerOutput<Data, MatchType>>;
  alertText?: TriggerField<Data, MatchType, TriggerOutput<Data, MatchType>>;
  alarmText?: TriggerField<Data, MatchType, TriggerOutput<Data, MatchType>>;
  tts?: TriggerField<Data, MatchType, PartialTriggerOutput<Data, MatchType>>;
} | undefined;
// The type of a response trigger field.
export type ResponseFunc<Data extends RaidbossData, MatchType extends NetAnyMatches> =
    (data: Data, matches: MatchType, output: Output) => ResponseOutput<Data, MatchType>;

export type ResponseField<Data extends RaidbossData, MatchType extends NetAnyMatches> =
    ResponseFunc<Data, MatchType> | ResponseOutput<Data, MatchType>;

export type TriggerAutoConfig = {
  Output?: Output;
  Duration?: number;
  BeforeSeconds?: number;
  OutputStrings?: OutputStrings;
  TextAlertsEnabled?: boolean;
  SoundAlertsEnabled?: boolean;
  SpokenAlertsEnabled?: boolean;
}

// Note: functions like run or preRun need to be defined as void-only as (confusingly)
// it is not possible to assign `(d: Data) => boolean` to a void | undefined, only to void.
export type TriggerField<Data extends RaidbossData, MatchType extends NetAnyMatches, Return> =
  [Return] extends [void] ? TriggerFunc<Data, MatchType, void> :
  TriggerFunc<Data, MatchType, Return | undefined> | Return | undefined;

// This trigger type is what we expect cactbot triggers to be written as,
// in other words `id` is not technically required for triggers but for
// built-in triggers it is.
export type BaseTrigger<Data extends RaidbossData, Type extends TriggerTypes> = {
  id: string;
  disabled?: boolean;
  condition?: TriggerField<Data, NetMatches[Type], boolean>;
  preRun?: TriggerField<Data, NetMatches[Type], void>;
  delaySeconds?: TriggerField<Data, NetMatches[Type], number>;
  durationSeconds?: TriggerField<Data, NetMatches[Type], number>;
  suppressSeconds?: TriggerField<Data, NetMatches[Type], number>;
  promise?: TriggerField<Data, NetMatches[Type], Promise<void>>;
  sound?: TriggerField<Data, NetMatches[Type], string>;
  soundVolume?: TriggerField<Data, NetMatches[Type], number>;
  response?: ResponseField<Data, NetMatches[Type]>;
  alarmText?: TriggerField<Data, NetMatches[Type], TriggerOutput<Data, NetMatches[Type]>>;
  alertText?: TriggerField<Data, NetMatches[Type], TriggerOutput<Data, NetMatches[Type]>>;
  infoText?: TriggerField<Data, NetMatches[Type], TriggerOutput<Data, NetMatches[Type]>>;
  tts?: TriggerField<Data, NetMatches[Type], PartialTriggerOutput<Data, NetMatches[Type]>>;
  run?: TriggerField<Data, NetMatches[Type], void>;
  outputStrings?: OutputStrings;
}

type PartialNetRegexTrigger<T extends TriggerTypes> = {
  type?: T;
  netRegex: CactbotBaseRegExp<T>;
  netRegexDe?: CactbotBaseRegExp<T>;
  netRegexFr?: CactbotBaseRegExp<T>;
  netRegexJa?: CactbotBaseRegExp<T>;
  netRegexCn?: CactbotBaseRegExp<T>;
  netRegexKo?: CactbotBaseRegExp<T>;
};

export type NetRegexTrigger<Data extends RaidbossData> =
  TriggerTypes extends infer T ? T extends TriggerTypes ?
  (BaseTrigger<Data, T> & PartialNetRegexTrigger<T>) : never : never;

export type GeneralNetRegexTrigger<Data extends RaidbossData, T extends TriggerTypes> =
  BaseTrigger<Data, T> & PartialNetRegexTrigger<T>;

type PartialRegexTrigger = {
  regex: RegExp;
  regexDe?: RegExp;
  regexFr?: RegExp;
  regexJa?: RegExp;
  regexCn?: RegExp;
  regexKo?: RegExp;
};

export type RegexTrigger<Data extends RaidbossData> =
    BaseTrigger<Data, 'None'> & PartialRegexTrigger;

export type TimelineTrigger<Data extends RaidbossData> = BaseTrigger<Data, 'None'> & {
  regex: RegExp;
  beforeSeconds?: number;
};

// Because timeline functions run during loading, they only support the base RaidbossData.
export type TimelineFunc = (data: RaidbossData) => TimelineField;
export type TimelineField = string | (string | TimelineFunc)[] | TimelineFunc | undefined;

export type DataInitializeFunc<Data extends RaidbossData> = () => Omit<Data, keyof RaidbossData>;

export type DisabledTrigger = { id: string; disabled: true };

// This helper takes all of the properties in Type and checks to see if they can be assigned to a
// blank object, and if so excludes them from the returned union. The `-?` syntax removes the
// optional modifier from the attribute which prevents `undefined` from being included in the union
// See also: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers
type RequiredFieldsAsUnion<Type> =
  {
    [key in keyof Type]-?: Record<string, never> extends Pick<Type, key> ? never : key
  }[keyof Type];

export type BaseTriggerSet<Data extends RaidbossData> = {
  // ZoneId.MatchAll (aka null) is not supported in array form.
  zoneId: ZoneId | number[];
  resetWhenOutOfCombat?: boolean;
  overrideTimelineFile?: boolean;
  timelineFile?: string;
  timeline?: TimelineField;
  triggers?: (NetRegexTrigger<Data> | DisabledTrigger)[];
  timelineTriggers?: (TimelineTrigger<Data> | DisabledTrigger)[];
  timelineReplace?: TimelineReplacement[];
  timelineStyles?: TimelineStyle[];
}

// If Data contains required properties that are not on RaidbossData, require initData
export type TriggerSet<Data extends RaidbossData> = BaseTriggerSet<Data> &
  (RequiredFieldsAsUnion<Data> extends RequiredFieldsAsUnion<RaidbossData> ?
  {
    initData?: DataInitializeFunc<Data>;
  } : {
    initData: DataInitializeFunc<Data>;
  });

// Less strict type for user triggers + built-in triggers, including deprecated fields.
export type LooseTimelineTrigger = Partial<TimelineTrigger<RaidbossData>>;

export type LooseTrigger = Partial<
    BaseTrigger<RaidbossData, 'None'> &
    PartialRegexTrigger &
    PartialNetRegexTrigger<'None'>
>;

export type LooseTriggerSet = Exclude<Partial<TriggerSet<RaidbossData>>, 'triggers' | 'timelineTriggers'> & {
    /** @deprecated Use zoneId instead */
    zoneRegex?: RegExp | { [lang in Lang]?: RegExp };
    triggers?: LooseTrigger[];
    timelineTriggers?: LooseTimelineTrigger[];
}
