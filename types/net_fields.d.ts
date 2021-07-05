type Fields = {
  type: 0;
  timestamp: 1;
};

// 0x00
type NetGameLogFields = Fields & {
  code: 2;
  name: 3;
  line: 4;
};

// 0x01
type NetChangeZoneFields = Fields & {
  id: 2;
  name: 3;
};

// 0x02, copied from emulator
type NetChangedPlayerFields = Fields & {
  id: 2;
  name: 3;
};

// 0x03
type NetAddedCombatantFields = Fields & {
  id: 2;
  name: 3;
  job: 4;
  level: 5;
  ownerId: 6;
  worldId: 7;
  world: 8;
  npcNameId: 9;
  npcBaseId: 10;
  currentHp: 11;
  hp: 12;
  // currentMp: 13;
  // mp: 14;
  // currentTp: 15;
  // tp: 16;
  x: 17;
  y: 18;
  z: 19;
  heading: 20;
};

// 0x04, identical to 0x03 for fields
type NetRemovedCombatantFields = NetAddedCombatantFields;

// 0x0C
type NetPlayerStatsFields = Fields & {
  job: 2;
  strength: 3;
  dexterity: 4;
  vitality: 5;
  intelligence: 6;
  mind: 7;
  piety: 8;
  attackPower: 9;
  directHit: 10;
  criticalHit: 11;
  attackMagicPotency: 12;
  healMagicPotency: 13;
  determination: 14;
  skillSpeed: 15;
  spellSpeed: 16;
  tenacity: 18;
};

// 0x14
type NetStartsUsingFields = Fields & {
  sourceId: 2;
  source: 3;
  id: 4;
  ability: 5;
  targetId: 6;
  target: 7;
  castTime: 8;
};

// 0x15
type NetAbilityFields = Fields & {
  sourceId: 2;
  source: 3;
  id: 4;
  ability: 5;
  targetId: 6;
  target: 7;
  flags: 8;
  damage: 9;
  targetCurrentHp: 24;
  targetMaxHp: 25;
  targetCurrentMp: 26;
  targetMaxMp: 27;
  // targetCurrentTp: 28;
  // targetMaxTp: 29;
  targetX: 30;
  targetY: 31;
  targetZ: 32;
  targetHeading: 33;
  currentHp: 34;
  maxHp: 35;
  currentMp: 36;
  maxMp: 37;
  // currentTp: 38;
  // maxTp: 39;
  x: 40;
  y: 41;
  z: 42;
  heading: 43;
};

// 0x16, identical to 0x15 for fields
type NetAOEAbilityFields = NetAbilityFields;

// 0x17, copied from emulator
type NetCancelAbilityFields = Fields & {
  sourceId: 2;
  source: 3;
  id: 4;
  name: 5;
  reason: 6;
};

// 0x18, copied from emulator
type NetDoTHoTFields = Fields & {
  id: 2;
  name: 3;
  type: 4;
  effectId: 5;
  damage: 6;
  currentHp: 7;
  maxHp: 8;
  currentMp: 9;
  maxMp: 10;
  // currentTp: 11;
  // maxTp: 12;
  x: 13;
  y: 14;
  z: 15;
  heading: 16;
};

// 0x19
type NetWasDefeatedFields = Fields & {
  targetId: 2;
  target: 3;
  sourceId: 4;
  source: 5;
};

// 0x1A
type NetGainsEffectFields = Fields & {
  effectId: 2;
  effect: 3;
  duration: 4;
  sourceId: 5;
  source: 6;
  targetId: 7;
  target: 8;
  count: 9;
  targetHp: 10;
  hp: 11;
};

// 0x1B
type NetHeadMarkerFields = Fields & {
  targetId: 2;
  target: 3;
  id: 6;
};

// 0x1C, copied from emulator
type NetFloorWaymarkerFields = Fields & {
  operation: 2;
  waymark: 3;
  id: 4;
  name: 5;
  x: 6;
  y: 7;
  z: 8;
};

// 0x1D, copied from emulator
type NetCombatantWaymarkerFields = Fields & {
  operation: 2;
  waymark: 3;
  id: 4;
  name: 5;
  targetId: 6;
  targetName: 7;
};

// 0x1E
type NetLosesEffectFields = Fields & {
  effectId: 2;
  effect: 3;
  sourceId: 5;
  source: 6;
  targetId: 7;
  target: 8;
  count: 9;
};

// 0x1F, copied from emulator
type NetJobGaugeFields = Fields & {
  id: 2;
  dataBytes1: 3;
  dataBytes2: 4;
  dataBytes3: 5;
  dataBytes4: 6;
};

// 0x21
type NetActorControlFields = Fields & {
  instance: 2;
  command: 3;
  data0: 4;
  data1: 5;
  data2: 6;
  data3: 7;
};

// 0x22
type NetNameToggleFields = Fields & {
  id: 2;
  name: 3;
  targetId: 4;
  targetName: 5;
  toggle: 6;
};

// 0x23
type NetTetherFields = Fields & {
  sourceId: 2;
  source: 3;
  targetId: 4;
  target: 5;
  id: 8;
};

// 0x24, copied from emulator
type NetLimitGaugeFields = Fields & {
  valueHex: 2;
  bars: 3;
};

// 0x25, copied from emulator
type NetActionSyncFields = Fields & {
  id: 2;
  name: 3;
  sequenceId: 4;
  currentHp: 5;
  maxHp: 6;
  currentMp: 7;
  maxMp: 8;
  // currentTp: 9;
  // maxTp: 10;
  x: 11;
  y: 12;
  z: 13;
  heading: 14;
};

// 0x26
type NetStatusEffectFields = Fields & {
  targetId: 2;
  target: 3;
  hp: 5;
  maxHp: 6;
  x: 11;
  y: 12;
  z: 13;
  heading: 14;
  data0: 15;
  data1: 16;
  data2: 17;
  data3: 18;
  data4: 19;
};

export type NetFields = {
  'GameLog': NetGameLogFields;
  'ChangeZone': NetChangeZoneFields;
  'ChangedPlayer': NetChangedPlayerFields;
  'AddedCombatant': NetAddedCombatantFields;
  'RemovedCombatant': NetRemovedCombatantFields;
  'PlayerStats': NetPlayerStatsFields;
  'StartsUsing': NetStartsUsingFields;
  'Ability': NetAbilityFields;
  'AOEAbility': NetAOEAbilityFields;
  'CancelAbility': NetCancelAbilityFields;
  'DoTHoT': NetDoTHoTFields;
  'WasDefeated': NetWasDefeatedFields;
  'GainsEffect': NetGainsEffectFields;
  'HeadMarker': NetHeadMarkerFields;
  'FloorWaymarker': NetFloorWaymarkerFields;
  'CombatantWaymarker': NetCombatantWaymarkerFields;
  'LosesEffect': NetLosesEffectFields;
  'JobGauge': NetJobGaugeFields;
  'ActorControl': NetActorControlFields;
  'NameToggle': NetNameToggleFields;
  'Tether': NetTetherFields;
  'LimitGauge': NetLimitGaugeFields;
  'ActionSync': NetActionSyncFields;
  'StatusEffect': NetStatusEffectFields;
  'None': Fields;
}

export type NetAnyFields = NetFields[keyof NetFields];
