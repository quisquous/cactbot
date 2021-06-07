import { Lang, NonEnLang } from './global';
import { RaidbossData } from './data';

export interface BaseRegExp<T> extends RegExp {
  groups?: {
    [s in T]?: string;
  };
}

export type Matches<Params> = { [s in Params]?: string };

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

export type MatchesAny = { [s in T]?: string };

// Note: functions like run or preRun need to be defined as void-only as (confusingly)
// it is not possible to assign `(d: Data) => boolean` to a void | undefined, only to void.
type OptionalUnlessVoid<T> = T extends void ? void : T | undefined;
export type TriggerField<Data, Return> =
    TriggerFunc<Data, MatchesAny, OptionalUnlessVoid<Return>> | OptionalUnlessVoid<Return>;

// This trigger type is what we expect cactbot triggers to be written as,
// in other words `id` is not technically required for triggers but for
// built-in triggers it is.
export type BaseTrigger<Data> = {
  id: string;
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
  regex: RegExp;
  beforeSeconds: number;
};

// Because timeline functions run during loading, they only support the base RaidbossData.
export type TimelineFunc = string | string[] | ((data: RaidbossData) => TimelineFunc);

export type TriggerSet<Data> = {
  // ZoneId.MatchAll (aka null) is not supported in array form.
  zoneId: ZoneId | number[];
  resetWhenOutOfCombat?: boolean;
  overrideTimelineFile?: boolean;
  timelineFile?: string;
  timeline?: TimelineFunc;
  triggers?: NetRegexTrigger<Data>[];
  timelineTriggers?: TimelineTrigger<Data>[];
  timelineReplace?: {
    locale: Lang;
    missingTranslations?: boolean;
    replaceText?: { [regex: string]: string };
    replaceSync?: { [regex: string]: string };
  }[];
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
