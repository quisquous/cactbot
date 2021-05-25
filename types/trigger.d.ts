import { Lang, NonEnLang } from './global';

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
    void | undefined | null | LocaleText | string | number | (() => TriggerOutput);

// The type of a non-response trigger field.
export type TriggerFunc<Matches> = (data: Data, matches: Matches, output: Output) => TriggerOutput;

// Valid fields to return from a ResponseFunc.
type ResponseFields = 'infoText' | 'alertText' | 'alarmText' | 'tts';

// The output from a response function (different from other TriggerOutput functions).
export type ResponseOutput<Matches> = {
  [text in ResponseFields]?: TriggerFunc<Matches>;
};
// The type of a response trigger field.
export type ResponseFunc<Matches> =
    (data: Data, matches: Matches, output: Output) => ResponseOutput<Matches>;

export type Trigger = {
  id: string;
  regex: RegExp;
  // TODO: complete this type
  [key: string]: unknown;
}

export type TimelineTrigger = Trigger & { beforeSeconds: number };

export type TriggerAutoConfig = {
  Output?: Output;
  Duration?: number;
  BeforeSeconds?: number;
  OutputStrings?: { [outputKey: string]: Lang };
}
