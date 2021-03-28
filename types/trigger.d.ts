import { Lang, NonEnLang } from './global';
import { Data } from './data';

export interface BaseRegExp<T> extends RegExp {
  groups?: {
    [s in T]?: string;
  };
}

export type Matches<T> =
  T extends BaseRegExp ? T['groups'] :
  T extends RegExp ? { [s: string]: string } :
  never;

export type FullLocaleText = Record<Lang, string>;

export type LocaleText = {
  en: string;
  [s in NonEnLang]?: string;
};

export type LocaleObject<T> = {
  en: T;
  [s in NonEnLang]?: T;
};


interface Output {
  responseOutputStrings?: Record<string, string>;

  [key: string]: ((s?: Record<string, unknown>) => string);
}

interface Replacement {
  [s: string]: string;
}


interface TimelineReplace {
  locale: Lang;
  replaceText: Replacement;
  replaceSync: Replacement;
}

type TriggerFunction<T, D = Data> = (data: D, matches?: Matches, output?: Output) => T | string;

interface BaseTrigger<D extends unknown> {
  id: string;
  disabled?: boolean;
  regex?: RegExp;
  regexDe?: RegExp;
  regexFr?: RegExp;
  regexJa?: RegExp;
  regexCn?: RegExp;
  regexKo?: RegExp;
  condition?: TriggerFunction<boolean, D>;
  preRun?: TriggerFunction<unknown, D>;
  promise?: TriggerFunction<Promise<unknown>, D>;
  delaySeconds?: number | TriggerFunction<number, D>;
  durationSeconds?: number | TriggerFunction<number, D>;
  suppressSeconds?: number | TriggerFunction<number, D>;
  sound?: string;
  soundVolume?: number;
  response?: TranslatedText | TriggerFunction<TranslatedText, D>;
  alarmText?: string | TranslatedText | TriggerFunction<TranslatedText, D>;
  alertText?: string | TranslatedText | TriggerFunction<TranslatedText, D>;
  infoText?: string | TranslatedText | TriggerFunction<TranslatedText, D>;
  tts?: string | TranslatedText | TriggerFunction<TranslatedText, D>;
  outputStrings?: Record<string, string | TranslatedText>;
  run?: TriggerFunction<unknown, D>;
}

interface TimeLineTrigger<D> extends BaseTrigger<D> {
  beforeSeconds?: number | TriggerFunction<number, D>;
}

interface LogTrigger<D> extends BaseTrigger<D> {
  netRegex?: RegExp;
  netRegexDe?: RegExp;
  netRegexFr?: RegExp;
  netRegexJa?: Readonly<RegExp>;
  netRegexCn?: RegExp;
  netRegexKo?: RegExp;
}

export interface TriggerSet<D = Data> {
  zoneId?: number;
  timelineFile?: string;
  timeline?: string;
  timelineTriggers?: TimeLineTrigger<D>[];
  locale?: Lang;
  timelineReplace?: TimelineReplace[];
  triggers?: LogTrigger<D>[];
  overrideTimelineFile?: boolean;
  resetWhenOutOfCombat?: boolean;
}
