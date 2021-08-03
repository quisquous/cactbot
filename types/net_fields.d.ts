import logDefinitions from '../resources/netlog_defs';

type Fields = {
  type: 0;
  timestamp: 1;
};

// TODO: add a netFieldsName to netlog_defs so this can be generated generically?
export type NetFields = {
  'GameLog': typeof logDefinitions.gameLog.fields;
  'ChangeZone': typeof logDefinitions.changeZone.fields;
  'ChangedPlayer': typeof logDefinitions.changePrimaryPlayer.fields;
  'AddedCombatant': typeof logDefinitions.addCombatant.fields;
  'RemovedCombatant': typeof logDefinitions.removeCombatant.fields;
  'PlayerStats': typeof logDefinitions.playerStats.fields;
  'StartsUsing': typeof logDefinitions.networkStartsCasting.fields;
  'Ability': typeof logDefinitions.networkAbility.fields;
  'AOEAbility': typeof logDefinitions.networkAbility.fields;
  'CancelAbility': typeof logDefinitions.networkCancelAbility.fields;
  'DoTHoT': typeof logDefinitions.networkDoT.fields;
  'WasDefeated': typeof logDefinitions.networkDeath.fields;
  'GainsEffect': typeof logDefinitions.networkBuff.fields;
  'HeadMarker': typeof logDefinitions.networkTargetIcon.fields;
  'FloorWaymarker': typeof logDefinitions.networkRaidMarker.fields;
  'CombatantWaymarker': typeof logDefinitions.networkTargetMarker.fields;
  'LosesEffect': typeof logDefinitions.networkBuffRemove.fields;
  'JobGauge': typeof logDefinitions.networkGauge.fields;
  'ActorControl': typeof logDefinitions.network6d.fields;
  'NameToggle': typeof logDefinitions.networkNameToggle.fields;
  'Tether': typeof logDefinitions.networkTether.fields;
  'LimitGauge': typeof logDefinitions.limitBreak.fields;
  'ActionSync': typeof logDefinitions.networkEffectResult.fields;
  'StatusEffect': typeof logDefinitions.networkStatusEffects.fields;
  'Map': typeof logDefinitions.map.fields;
  'None': Fields;
};

// This type helper reverses the keys and values of a given type, e.g this:
// {1: 'a'}
// becomes this:
// {a: 1}
type Reverse<T> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T];
};

export type NetFieldsReverse = {
  [K in keyof NetFields]: Reverse<NetFields[K]>;
};

export type NetAnyFields = NetFields[keyof NetFields];
