import { Lang } from '../resources/languages';
import PartyTracker from '../resources/party';

import { Job, Role } from './job';

export interface BaseOptions {
  ParserLanguage: Lang;
  ShortLocale: Lang;
  DisplayLanguage: Lang;
  TextAlertsEnabled: boolean;
  SoundAlertsEnabled: boolean;
  SpokenAlertsEnabled: boolean;
  GroupSpokenAlertsEnabled: boolean;
  Skin?: string;
  [key: string]: unknown;
  // todo: complete this type
}

export interface RaidbossData {
  job: Job;
  me: string;
  role: Role;
  party: PartyTracker;
  lang: Lang;
  parserLang: Lang;
  displayLang: Lang;
  currentHP: number;
  options: BaseOptions;
  ShortName: (x?: string) => string;
  StopCombat: () => void;
  /** @deprecated Use parseFloat instead */
  ParseLocaleFloat: (string: string) => number;
  CanStun: () => boolean;
  CanSilence: () => boolean;
  CanSleep: () => boolean;
  CanCleanse: () => boolean;
  CanFeint: () => boolean;
  CanAddle: () => boolean;
}
