import PartyTracker from '../resources/party.js';
import { Option } from './global';
import { Job, Role } from './job';

export interface Data {
  job: Job;
  me: string;
  role: Role;
  party: PartyTracker;
  lang: string;
  currentHP: number;
  options: Option;
  ShortName: (x: string) => string;
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
