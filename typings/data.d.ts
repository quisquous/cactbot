import PartyTracker from '../resources/party.js';
import { Lang } from './global';

export interface Data {
  job: string;
  me: string;
  role: string,
  party: PartyTracker,
  lang: string,
  currentHP: number,
  options: {
    ParserLanguage: Lang,
    LangShortLocale: Lang,
    DisplayLanguage: Lang,
    [key: string]: unknown,
    // todo: complete this type
  },
  ShortName(x: string): string,
  StopCombat(): void,
  ParseLocaleFloat(string: string): number;
  CanStun(): boolean,
  CanSilence(): boolean,
  CanSleep(): boolean,
  CanCleanse(): boolean,
  CanFeint(): boolean,
  CanAddle(): boolean,
}
