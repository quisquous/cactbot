import { NetAllMatches } from './net_matches';

export class CactbotRegExpExecArray<T extends TriggerTypes> extends RegExpExecArray {
  groups?: NetAllMatches[T];
}

export class CactbotBaseRegExp<T extends TriggerTypes> extends RegExp {
  exec(string: string): CactbotRegExpExecArray<T> | null;
}

export type TriggerTypes = 'GameLog' |
  'ChangeZone' |
  'ChangedPlayer' |
  'AddedCombatant' |
  'RemovedCombatant' |
  'PlayerStats' |
  'HasHP' |
  'StartsUsing' |
  'Ability' |
  'AOEAbility' |
  'CancelAbility' |
  'DoTHoT' |
  'WasDefeated' |
  'GainsEffect' |
  'HeadMarker' |
  'FloorWaymarker' |
  'CombatantWaymarker' |
  'LosesEffect' |
  'JobGauge' |
  'ActorControl' |
  'NameToggle' |
  'Tether' |
  'LimitGauge' |
  'ActionSync' |
  'StatusEffect' |
  'None';
