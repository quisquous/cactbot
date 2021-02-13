import { lang } from './global';
import { Data } from './data';

export interface Output {
  [key: string]: () => string
}

interface Match {
  target?: string
  [key: string]: string
}


type LanguageText = Record<lang, string>
type Response = (data: Data, matches: Match, output: Output) => string | LanguageText

export interface BaseTrigger {
  id: string,
  disabled?: boolean,
  regex?: RegExp,
  regexCn?: RegExp,
  regexDe?: RegExp,
  regexFr?: RegExp,
  regexJa?: RegExp,
  regexKo?: RegExp,
  condition?(data: Data, matches: Match): boolean,
  preRun?(data: Data, matches: Match): void,
  delaySeconds?: number,
  durationSeconds?: number,
  suppressSeconds?: number,
  promise?(data: Data, matches): void,
  sound?: string,
  soundVolume?: number,
  response?: Response,
  alarmText?: LanguageText | Response,
  alertText?: LanguageText | Response,
  infoText?: LanguageText | Response,
  tts?: LanguageText,
  run?(data: Data, matches: Match): void,
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
