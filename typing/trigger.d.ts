import { Data } from './data.d.ts';

export interface Output {
  text(): string,
}

interface Match extends RegExpMatchArray {
  target?: string
}

type Response = (data: Data, matches: Match, output: Output) => string

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
  response?: Response,
  alarmText?: Record<lang, string> | Response,
  alertText?: Record<lang, string> | Response,
  infoText?: Record<lang, string> | Response,
  tts?: Record<lang, string>,
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
