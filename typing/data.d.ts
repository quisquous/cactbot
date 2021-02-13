import PartyTracker from '../resources/party.js';

export interface Data {
  job: string;
  me: string;
  role: string,
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
