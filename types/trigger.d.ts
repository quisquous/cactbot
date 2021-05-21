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
export type TriggerFunc<Matches, Return> =
    (data: RaidbossData, matches: Matches, output: Output) => Return;

// Valid fields to return from a ResponseFunc.
type ResponseFields = 'infoText' | 'alertText' | 'alarmText' | 'tts';

// The output from a response function (different from other TriggerOutput functions).
export type ResponseOutput<Matches> = {
  [text in ResponseFields]?: TriggerFunc<Matches, TriggerOutput>;
};
// The type of a response trigger field.
export type ResponseFunc<Matches> =
    (data: RaidbossData, matches: Matches, output: Output) => ResponseOutput<Matches>;

export type ResponseField = ResponseFunc<MatchesAny> | ResponseOutput<MatchesAny>;

export type TriggerAutoConfig = {
  Output?: Output;
  Duration?: number;
  BeforeSeconds?: number;
  OutputStrings?: { [outputKey: string]: Lang };
}

export type MatchesAny = { [s in T]?: string } | undefined;
export type TriggerField<Return> = TriggerFunc<MatchesAny, Return> | Return;

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
export type BaseTrigger = {
  id?: string;
  disabled?: boolean;
  condition?: TriggerField<boolean | undefined>;
  preRun?: TriggerField<void>;
  delaySeconds?: TriggerField<number | undefined>;
  durationSeconds?: TriggerField<number | undefined>;
  suppressSeconds?: TriggerField<number | undefined>;
  promise?: TriggerField<Promise<void> | undefined>;
  sound?: TriggerField<string | undefined>;
  soundVolume?: TriggerField<number | undefined>;
  response?: ResponseField;
  alarmText?: TriggerField<TriggerOutput>;
  alertText?: TriggerField<TriggerOutput>;
  infoText?: TriggerField<TriggerOutput>;
  tts?: TriggerField<TriggerOutput>;
  run?: TriggerField<void>;
  outputStrings?: {
    [key: string]: LocaleText;
  };
}

export type NetRegexTrigger = BaseTrigger & {
  netRegex: RegExp;
  netRegexDe?: RegExp;
  netRegexFr?: RegExp;
  netRegexJa?: RegExp;
  netRegexCn?: RegExp;
  netRegexKo?: RegExp;
}

export type RegexTrigger = BaseTrigger & {
  regex: RegExp;
  regexDe?: RegExp;
  regexFr?: RegExp;
  regexJa?: RegExp;
  regexCn?: RegExp;
  regexKo?: RegExp;
}

export type TimelineTrigger = BaseTrigger & {
  regex?: RegExp;
  // TODO: can this also be a function?
  beforeSeconds?: number;
};

export type Trigger = RegexTrigger | NetRegexTrigger;

export type TimelineFunc = string | string[] | ((data: RaidbossData) => TimelineFunc);

export type TriggerSet = {
  zoneId?: number;
  zoneRegex?: RegExp | { [lang in Lang]?: RegExp };
  resetWhenOutOfCombat?: boolean;
  overrideTimelineFile?: boolean;
  timelineFile?: string;
  timeline?: TimelineFunc;
  triggers?: Trigger[];
  timelineTriggers?: TimelineTrigger[];
  timelineReplace?: {
    locale: Lang;
    missingTranslations?: boolean;
    replaceText?: { [regex: string]: string };
    replaceSync?: { [regex: string]: string };
  }[];
}
