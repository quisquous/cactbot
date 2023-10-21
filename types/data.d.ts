import { Lang } from '../resources/languages';
import PartyTracker from '../resources/party';
import { ConfigValue } from '../resources/user_config';
import { OopsyOptions } from '../ui/oopsyraidsy/oopsy_options';

import { SystemInfo } from './event';
import { Job, Role } from './job';
import { NetMatches } from './net_matches';

export interface BaseOptions {
  ParserLanguage: Lang;
  ShortLocale: Lang;
  DisplayLanguage: Lang;
  TextAlertsEnabled: boolean;
  SoundAlertsEnabled: boolean;
  SpokenAlertsEnabled: boolean;
  GroupSpokenAlertsEnabled: boolean;
  Skin?: string;
  SystemInfo: SystemInfo;
  Debug: boolean;
  [key: string]: unknown;
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
  inCombat: boolean;
  triggerSetConfig: { [key: string]: ConfigValue };
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

export interface OopsyData {
  job: Job;
  me: string;
  role: Role;
  party: PartyTracker;
  inCombat: boolean;
  IsImmune: (x?: string) => boolean;
  ShortName: (x?: string) => string;
  IsPlayerId: (x?: string) => boolean;
  DamageFromMatches: (matches: NetMatches['Ability']) => number;
  options: OopsyOptions;

  /** @deprecated Use parseFloat instead */
  ParseLocaleFloat: (string: string) => number;
}
