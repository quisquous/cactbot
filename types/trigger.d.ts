import { Lang, NonEnLang } from '../resources/languages';
import { TimelineReplacement, TimelineStyle } from '../ui/raidboss/timeline';
import { RaidbossData } from './data';
import { CactbotBaseRegExp, TriggerTypes } from './net_trigger';
import { NetMatches, Matches } from '../types/net_matches';

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
export type TriggerOutput<Data extends RaidbossData, MatchType extends Matches> =
    undefined | null | LocaleText | string | number | boolean |
    ((d: Data, m: MatchType, o: Output) => TriggerOutput<Data, MatchType>);

// Used if the function doesn't need to return an en key
export type PartialTriggerOutput<Data extends RaidbossData, MatchType extends Matches> =
    undefined | null | Partial<LocaleText> | string | number | boolean |
    ((d: Data, m: MatchType, o: Output) => PartialTriggerOutput<Data, MatchType>);

// The type of a non-response trigger field.
export type TriggerFunc<Data extends RaidbossData, MatchType extends Matches, Return> =
    (data: Data, matches: MatchType, output: Output) => Return;

// The output from a response function (different from other TriggerOutput functions).
export type ResponseOutput<Data extends RaidbossData, MatchType extends Matches> = {
  infoText?: TriggerFunc<Data, MatchType, TriggerOutput<Data, MatchType>>;
  alertText?: TriggerFunc<Data, MatchType, TriggerOutput<Data, MatchType>>;
  alarmText?: TriggerFunc<Data, MatchType, TriggerOutput<Data, MatchType>>;
  tts?: TriggerFunc<Data, MatchType, PartialTriggerOutput<Data, MatchType>>;
};
// The type of a response trigger field.
export type ResponseFunc<Data extends RaidbossData, MatchType extends Matches> =
    (data: Data, matches: MatchType, output: Output) => ResponseOutput<Data, MatchType>;

export type ResponseField<Data extends RaidbossData, MatchType extends Matches> =
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
export type TriggerField<Data extends RaidbossData, MatchType extends Matches, Return> =
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
  beforeSeconds: number;
};

// Because timeline functions run during loading, they only support the base RaidbossData.
export type TimelineFunc = string | string[] | ((data: RaidbossData) => TimelineFunc);

export type DataInitializeFunc<Data extends RaidbossData> = () => Omit<Data, keyof RaidbossData>;

export type TriggerSet<Data extends RaidbossData> = {
  // ZoneId.MatchAll (aka null) is not supported in array form.
  zoneId: ZoneId | number[];
  resetWhenOutOfCombat?: boolean;
  overrideTimelineFile?: boolean;
  timelineFile?: string;
  timeline?: TimelineFunc;
  triggers?: NetRegexTrigger<Data>[];
  timelineTriggers?: TimelineTrigger<Data>[];
  timelineReplace?: TimelineReplacement[];
  timelineStyles?: TimelineStyle[];
  initData?: DataInitializeFunc<Data>;
}

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
