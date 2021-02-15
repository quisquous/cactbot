import PartyTracker from '../resources/party.js';
import { Lang } from './global';

export interface Option {
  ParserLanguage: Lang;
  LangShortLocale: Lang;
  DisplayLanguage: Lang;
  [key: string]: unknown;
  // todo: complete this type
}

export interface Data {
  job: string;
  me: string;
  role: string;
  party: PartyTracker;
  lang: string;
  currentHP: number;
  options: Option;
  ShortName(x: string): string;
  StopCombat(): void;
  /** @deprecated Use parseFloat instead */
  ParseLocaleFloat(string: string): number;
  CanStun(): boolean;
  CanSilence(): boolean;
  CanSleep(): boolean;
  CanCleanse(): boolean;
  CanFeint(): boolean;
  CanAddle(): boolean;
}
