import { Job, Role } from '../resources/util';
import PartyTracker from '../resources/party.js';

export interface Data {
  job: Job;
  me: string;
  role: Role,
  party: PartyTracker,
  lang: string,
  currentHP: number,
  options: Record<string, unknown>, // todo: add type
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
