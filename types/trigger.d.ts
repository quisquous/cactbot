import { Lang, NonEnLang } from '../resources/languages';
import { TimelineReplacement, TimelineStyle } from '../ui/raidboss/timeline';
import { RaidbossData } from './data';
import { MatchesAllTypes, MatchesAbilityFull, MatchesAbility, MatchesGainsEffect, MatchesLosesEffect, MatchesStartsUsing, MatchesTether, MatchesWasDefeated } from '../resources/matches';
import { Regex } from '../resources/regexes';
import { NetRegex } from '../resources/netregexes';

export interface BaseRegExpExecArray<T> extends RegExpExecArray {
  groups?: {
    [s in T]: string;
  };
}

export interface BaseRegExp<T> extends RegExp {
  exec: (string: string) => BaseRegExpExecArray<T> | null;
}

export type Matches<Params> = { [s in Params]: string };

// TargetedMatches can be used for generic functions in responses or conditions
// that use matches from any number of Regex or NetRegex functions.
export type TargetedMatches =
  MatchesStartsUsing | MatchesAbility | MatchesAbilityFull | MatchesGainsEffect |
  MatchesLosesEffect | MatchesTether | MatchesWasDefeated;

export type MatchesAny = (MatchesAllTypes extends infer T ? T extends MatchesAllTypes ?
  Matches<T> : never : never) | { [k: string]: string };

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
  [key: string]: (params?: { [param: string]: string | undefined }) => string;
};

// The output of any non-response raidboss trigger function.
export type TriggerOutput<Data, Matches extends MatchesAny> =
    undefined | null | LocaleText | string | number | boolean |
    ((d: Data, m: MatchesAll<Matches>, o: Output) => TriggerOutput<Data, Matches>);

// Used if the function doesn't need to return an en key
export type PartialTriggerOutput<Data, Matches extends MatchesAny> =
    undefined | null | Partial<LocaleText> | string | number | boolean |
    ((d: Data, m: MatchesAll<Matches>, o: Output) => PartialTriggerOutput<Data, Matches>);

// The type of a non-response trigger field.
export type TriggerFunc<Data, Matches, Return> =
    (data: Data, matches: MatchesAll<Matches>, output: Output) => Return;

// The output from a response function (different from other TriggerOutput functions).
export type ResponseOutput<Data, Matches> = {
  infoText?: TriggerFunc<Data, Matches, TriggerOutput<Data, Matches>>;
  alertText?: TriggerFunc<Data, Matches, TriggerOutput<Data, Matches>>;
  alarmText?: TriggerFunc<Data, Matches, TriggerOutput<Data, Matches>>;
  tts?: TriggerFunc<Data, Matches, PartialTriggerOutput<Data, Matches>>;
};
// The type of a response trigger field.
export type ResponseFunc<Data, Matches extends MatchesAny> =
    (data: Data, matches: MatchesAll<Matches>, output: Output) => ResponseOutput<Data, Matches>;

export type ResponseField<Data, Matches> =
    ResponseFunc<Data, Matches> | ResponseOutput<Data, Matches>;

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
export type TriggerField<Data, Return, Matches> =
  [Return] extends [void] ? TriggerFunc<Data, Matches, void> :
  TriggerFunc<Data, Matches, Return | undefined> | Return | undefined;

// This trigger type is what we expect cactbot triggers to be written as,
// in other words `id` is not technically required for triggers but for
// built-in triggers it is.
export type BaseTrigger<Data, Matches> = {
  id: string;
  disabled?: boolean;
  condition?: TriggerField<Data, boolean, Matches>;
  preRun?: TriggerField<Data, void, Matches>;
  delaySeconds?: TriggerField<Data, number, Matches>;
  durationSeconds?: TriggerField<Data, number, Matches>;
  suppressSeconds?: TriggerField<Data, number, Matches>;
  promise?: TriggerField<Data, Promise<void>, Matches>;
  sound?: TriggerField<Data, string, Matches>;
  soundVolume?: TriggerField<Data, number, Matches>;
  response?: ResponseField<Data, Matches>;
  alarmText?: TriggerField<Data, TriggerOutput<Data, Matches>, Matches>;
  alertText?: TriggerField<Data, TriggerOutput<Data, Matches>, Matches>;
  infoText?: TriggerField<Data, TriggerOutput<Data, Matches>, Matches>;
  tts?: TriggerField<Data, PartialTriggerOutput<Data, Matches>, Matches>;
  run?: TriggerField<Data, void, Matches>;
  outputStrings?: OutputStrings;
}

export type NetRegexTrigger<Data> =
  MatchesAllTypes extends infer T ? [T] extends [MatchesAllTypes] ?
(BaseTrigger<Data, Matches<T>> & {
  netRegex: NetRegex<Matches<T>>;
  netRegexDe?: NetRegex<Matches<T>>;
  netRegexFr?: NetRegex<Matches<T>>;
  netRegexJa?: NetRegex<Matches<T>>;
  netRegexCn?: NetRegex<Matches<T>>;
  netRegexKo?: NetRegex<Matches<T>>;
}) : never : never;

export type RegexTrigger<Data> =
  MatchesAllTypes extends infer T ? [T] extends [MatchesAllTypes] ?
(BaseTrigger<Data, Matches<T>> & {
  regex: Regex<Matches<T>>;
  regexDe?: Regex<Matches<T>>;
  regexFr?: Regex<Matches<T>>;
  regexJa?: Regex<Matches<T>>;
  regexCn?: Regex<Matches<T>>;
  regexKo?: Regex<Matches<T>>;
}) : never : never;

export type TimelineTrigger<Data> = BaseTrigger<Data, MatchesAny> & {
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

export type LooseTrigger =
    Partial<RegexTrigger<RaidbossData>> | Partial<NetRegexTrigger<RaidbossData>>;

export type LooseTriggerSet = Exclude<Partial<TriggerSet<RaidbossData>>, 'triggers' | 'timelineTriggers'> & {
    /** @deprecated Use zoneId instead */
    zoneRegex?: RegExp | { [lang in Lang]?: RegExp };
    triggers?: LooseTrigger[];
    timelineTriggers?: LooseTimelineTrigger[];
}
