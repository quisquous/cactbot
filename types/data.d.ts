import PartyTracker from '../resources/party.js';
import { Lang } from './global';
import { Job, Role } from './job';

// All overlay options support these fields.
// Different overlay types should extend this interface with extra fields.
export interface BaseOptions {
  ParserLanguage: Lang;
  DisplayLanguage: Lang;
  ShortLocale: string;
  SystemLocale: string;
  Debug: boolean;
  Skin: string;

  /** @deprecated for backwards compatibility, use ParserLanguage/DisplayLanguage instead */
  Language: Lang;

  // This supports setting values from config files from unknown keys in user_config.ts.
  [key: string]: unknown;
}

// TODO: should this be named RaidbossData? Or can code that is using both this and oopsy
// differentiate themselves if they need to? Probably this *file* needs to be renamed
// to be raidboss_data.d.ts?
export interface Data {
  job: Job;
  me: string;
  role: Role;
  party: PartyTracker;
  lang: string;
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
