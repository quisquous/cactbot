import { Data } from './data.d.ts';

export interface Output {
  text(): string,
}

export interface BaseTrigger {
  id: string,
  disabled?: boolean,
  regex?: RegExp,
  regexCn?: RegExp,
  regexDe?: RegExp,
  regexFr?: RegExp,
  regexJa?: RegExp,
  regexKo?: RegExp,
  condition?(data: Data, matches): boolean,
  preRun?(data, matches): void,
  delaySeconds?: number,
  durationSeconds?: number,
  suppressSeconds?: number,
  promise?(data: Data, matches): void,
  sound?: string,
  soundVolume?: number,
  response?(data: Data, matches, output: Output): string,
  alarmText?: Record<string, string>,
  alertText?: Record<string, string>,
  infoText?: Record<string, string>,
  tts?: Record<string, string>,
  run?(data: Data, matches): void,
  outputStrings?: Record<string, unknown>,
}

export interface TimeLineTrigger extends BaseTrigger {
  beforeSeconds?: number,
}

export interface LogTrigger extends BaseTrigger {
  netRegex?: RegExp,
  netRegexCn?: RegExp,
  netRegexDe?: RegExp,
  netRegexFr?: RegExp,
  netRegexJa?: RegExp,
  netRegexKo?: RegExp,
}
