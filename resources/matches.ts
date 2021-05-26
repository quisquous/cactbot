import {
  StartsUsingParams,
  AbilityParams,
  AbilityFullParams,
  HeadMarkerParams,
  AddedCombatantParams,
  AddedCombatantFullParams,
  RemovingCombatantParams,
  GainsEffectParams,
  StatusEffectExplicitParams,
  LosesEffectParams,
  TetherParams,
  WasDefeatedParams,
  EchoParams,
  DialogParams,
  MessageParams,
  GameLogParams,
  GameNameLogParams,
  StatChangeParams,
  ChangeZoneParams,
  Network6dParams,
  NameToggleParams,
} from './netregexes';
import { Matches } from '../types/trigger';

export type MatchesStartsUsing = Matches<StartsUsingParams>;
export type MatchesAbility = Matches<AbilityParams>;
export type MatchesAbilityFull = Matches<AbilityFullParams>;
export type MatchesHeadMarker = Matches<HeadMarkerParams>;
export type MatchesAddedCombatant = Matches<AddedCombatantParams>;
export type MatchesAddedCombatantFull = Matches<AddedCombatantFullParams>;
export type MatchesRemovingCombatant = Matches<RemovingCombatantParams>;
export type MatchesGainsEffect = Matches<GainsEffectParams>;
export type MatchesStatusEffectExplicit = Matches<StatusEffectExplicitParams>;
export type MatchesLosesEffect = Matches<LosesEffectParams>;
export type MatchesTether = Matches<TetherParams>;
export type MatchesWasDefeated = Matches<WasDefeatedParams>;
export type MatchesEcho = Matches<EchoParams>;
export type MatchesDialog = Matches<DialogParams>;
export type MatchesMessage = Matches<MessageParams>;
export type MatchesGameLog = Matches<GameLogParams>;
export type MatchesGameNameLog = Matches<GameNameLogParams>;
export type MatchesStatChange = Matches<StatChangeParams>;
export type MatchesChangeZone = Matches<ChangeZoneParams>;
export type MatchesNetwork6d = Matches<Network6dParams>;
export type MatchesNameToggle = Matches<NameToggleParams>;
