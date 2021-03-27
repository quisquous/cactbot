import { Matches, TranslatableText } from './trigger';
import { Data } from './data';

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
  response?: TranslatableText | TriggerFunction<TranslatableText, D>;
  alarmText?: string | TranslatableText | TriggerFunction<TranslatableText, D>;
  alertText?: string | TranslatableText | TriggerFunction<TranslatableText, D>;
  infoText?: string | TranslatableText | TriggerFunction<TranslatableText, D>;
  tts?: string | TranslatableText | TriggerFunction<TranslatableText, D>;
  outputStrings?: Record<string, string | TranslatableText>;
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

export interface TriggerFile<D = Data> {
  Triggers: TriggerSet<D>[];

  // #region raidboss options
  PlayerNicks: { [s: string]: string };
  // #endregion
}


