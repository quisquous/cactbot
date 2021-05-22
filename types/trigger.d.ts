import { Lang, NonEnLang } from './global';
import { RaidbossData } from './data';

export interface BaseRegExp<T> extends RegExp {
  groups?: {
    [s in T]?: string;
  };
}

export type Matches<Params> = { [s in Params]?: string } | undefined;

// TargetedMatches can be used for generic functions in responses or conditions
// that use matches from any number of Regex or NetRegex functions.
export type TargetedParams = 'sourceId' | 'source' | 'targetId' | 'target';
export type TargetedMatches = Matches<TargetedParams>;

export type FullLocaleText = Record<Lang, string>;

export type LocaleObject<T> = {
  en: T;
} & {
  [s in NonEnLang]?: T;
};

export type LocaleText = LocaleObject<string>;

export type ZoneId = number | null;

// TODO: is it awkward to have Outputs the static class and Output the unrelated type?
// This type corresponds to TriggerOutputProxy.
export type Output = {
  responseOutputStrings: {
    [outputKey: string]: LocaleText;
  };
} & {
  [key: string]: (params?: { [param: string]: string | undefined }) => string;
};

// The output of any non-response raidboss trigger function.
export type TriggerOutput =
    undefined | null | LocaleText | string | number | boolean | (() => TriggerOutput);

// The type of a non-response trigger field.
export type TriggerFunc<Data, Matches, Return> =
    (data: Data, matches: Matches, output: Output) => Return;

// Valid fields to return from a ResponseFunc.
type ResponseFields = 'infoText' | 'alertText' | 'alarmText' | 'tts';

// The output from a response function (different from other TriggerOutput functions).
export type ResponseOutput<Data, Matches> = {
  [text in ResponseFields]?: TriggerFunc<Data, Matches, TriggerOutput>;
};
// The type of a response trigger field.
export type ResponseFunc<Data, Matches> =
    (data: Data, matches: Matches, output: Output) => ResponseOutput<Data, Matches>;

export type ResponseField<Data> = ResponseFunc<Data, MatchesAny> | ResponseOutput<Data, MatchesAny>;

export type TriggerAutoConfig = {
  Output?: Output;
  Duration?: number;
  BeforeSeconds?: number;
  OutputStrings?: { [outputKey: string]: Lang };
}

export type MatchesAny = { [s in T]?: string } | undefined;

type OptionalUnlessVoid<T> = T extends void ? void : T | undefined;
export type TriggerField<Data, Return> =
    TriggerFunc<Data, MatchesAny, OptionalUnlessVoid<Return>> | OptionalUnlessVoid<Return>;

// TODO: I am not sure that it is possible to type triggers such that we have some gigantic union
// of Trigger<TetherParams> | Trigger<AbilityParams> | Trigger<AddedCombatantParams> | etc etc
// and so the idea is that individual files would use a narrower type for Matches if they wanted to
// and that's something we (maybe?) could enforce via tests rather than via TypeScript.  This
// approach would not preclude some TypeScript gigabrain solution that can figure out how to do
// the same thing at the TypeScript level.
//
// TODO: I think there are two types of TriggerSets.  There is the "cactbot + user defined triggers"
// and also the "cactbot built-in only" triggers, which can be more strict.  For example,
// * is `id` required, and `regex` for timeline triggers? (yes for built-in, no for user triggers)
// * should we handle nonsense like `condition` returning non-booleans?
// We could have one type that built-in triggers define themselves as more strictly and then a
// second type that popup-text.js uses and needs to do more narrowing for.
export type BaseTrigger<Data> = {
  id?: string;
  disabled?: boolean;
  condition?: TriggerField<Data, boolean>;
  preRun?: TriggerField<Data, void>;
  delaySeconds?: TriggerField<Data, number>;
  durationSeconds?: TriggerField<Data, number>;
  suppressSeconds?: TriggerField<Data, number>;
  promise?: TriggerField<Promise<Data, void>>;
  sound?: TriggerField<Data, string>;
  soundVolume?: TriggerField<Data, number>;
  response?: ResponseField<Data>;
  alarmText?: TriggerField<Data, TriggerOutput>;
  alertText?: TriggerField<Data, TriggerOutput>;
  infoText?: TriggerField<Data, TriggerOutput>;
  tts?: TriggerField<Data, TriggerOutput>;
  run?: TriggerField<Data, void>;
  outputStrings?: {
    [key: string]: LocaleText;
  };
}

export type NetRegexTrigger<Data> = BaseTrigger<Data> & {
  netRegex: RegExp;
  netRegexDe?: RegExp;
  netRegexFr?: RegExp;
  netRegexJa?: RegExp;
  netRegexCn?: RegExp;
  netRegexKo?: RegExp;
}

export type RegexTrigger<Data> = BaseTrigger<Data> & {
  regex: RegExp;
  regexDe?: RegExp;
  regexFr?: RegExp;
  regexJa?: RegExp;
  regexCn?: RegExp;
  regexKo?: RegExp;
}

export type TimelineTrigger<Data> = BaseTrigger<Data> & {
  regex?: RegExp;
  // TODO: can this also be a function?
  beforeSeconds?: number;
};

export type Trigger<Data> = RegexTrigger<Data> | NetRegexTrigger<Data>;

// Because timeline functions run during loading, they only support the base RaidbossData.
export type TimelineFunc = string | string[] | ((data: RaidbossData) => TimelineFunc);

export type TriggerSet<Data> = {
  // ZoneId.MatchAll (aka null) is not supported in array form.
  zoneId?: ZoneId | number[];
  zoneRegex?: RegExp | { [lang in Lang]?: RegExp };
  resetWhenOutOfCombat?: boolean;
  overrideTimelineFile?: boolean;
  timelineFile?: string;
  timeline?: TimelineFunc;
  triggers?: Trigger<Data>[];
  timelineTriggers?: TimelineTrigger<Data>[];
  timelineReplace?: {
    locale: Lang;
    missingTranslations?: boolean;
    replaceText?: { [regex: string]: string };
    replaceSync?: { [regex: string]: string };
  }[];
}
